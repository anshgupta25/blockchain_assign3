App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        return App.initWeb3();
    },

    initWeb3: function() {
        // TODO: refactor conditional
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function() {
        $.getJSON("CharityDapp.json", function(CharityDapp) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.CharityDapp = TruffleContract(CharityDapp);
            // Connect provider to interact with contract
            App.contracts.CharityDapp.setProvider(App.web3Provider);

            App.listenForEvents();

            return App.render();
        });
    },

    // Listen for events emitted from the contract
    listenForEvents: function() {
        App.contracts.CharityDapp.deployed().then(function(instance) {
            // Restart Chrome if you are unable to receive this event
            // This is a known issue with Metamask
            // https://github.com/MetaMask/metamask-extension/issues/2393
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error, event) {
                // Reload when a new donate is recorded
                App.render();
            });
        });
    },

    render: function() {
        var CharityDappinstance;
        var loader = $("#loader");
        var content = $("#content");

        loader.show();
        content.hide();

        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("Your Account: " + account);
            }
        });

        // Load contract data
        App.contracts.CharityDapp.deployed().then(function(instance) {
            CharityDappinstance = instance;
            return CharityDappinstance.charity_num(); //////////////////////////////////////////////////////
        }).then(function(charity_num) {
            var CHARITY = $("#CHARITY");
            CHARITY.empty();

            var SELECT_CHARITY = $('#SELECT_CHARITY');
            SELECT_CHARITY.empty();

            for (var i = 1; i <= charity_num; i++) {
                CharityDappinstance.charities(i).then(function(Charity_Info) {
                    var id = Charity_Info[0];
                    var name = Charity_Info[1];
                    var desc = Charity_Info[2];
                    var voteCount = Charity_Info[3];
                    var donation = Charity_Info[4];

                    // Render Charity_Info Result
                    var data_charity = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + desc + "</td><td>" + voteCount + "</td><td>" + donation + "</tr>"
                    CHARITY.append(data_charity);

                    // Render Charity_Info ballot option
                    var option_charity = "<option value='" + id + "' >" + name + "</ option>"
                    SELECT_CHARITY.append(option_charity);
                });
            }
            // return CharityDappinstance.students(App.account);

        }).then(function() {
            // Do not allow a user to donate
            // if() {
            //   $('form').hide();
            //   console.log(": " );
            // }
            loader.hide();
            content.show();
        }).catch(function(error) {
            console.warn(error);
            console.log("error: " + error);
        });
    },

    donation: function() {
        var charity_ID = $('#SELECT_CHARITY').val();
        var amt_donate = $('#amt_donate').val();
        console.log("charity_ID: " + charity_ID + " amt_donate: " + amt_donate);
        App.contracts.CharityDapp.deployed().then(function(instance) {
            //return charity_ID and amt_donate to the contract
            return instance.donate(charity_ID, amt_donate, { from: App.account });
            // return instance.donate(charity_ID,amt_donate, { from: App.account });
        }).then(function(result) {
            // Wait for votes to update
            $("#content").hide();
            $("#loader").show();
        }).catch(function(err) {
            console.error(err);
        });
    },
    addCharity: function() {
        var charity_name = $('#charity_name').val();
        var charity_desc = $('#charity_desc').val();
        console.log("charity_name: " + charity_name);
        App.contracts.CharityDapp.deployed().then(function(instance) {
            //return charity_ID and amt_donate to the contract
            return instance.addCharity(charity_name, charity_desc, { from: App.account });
            // return instance.donate(charity_ID,amt_donate, { from: App.account });
        }).then(function(result) {
            // Wait for votes to update
            $("#content").hide();
            // $("#loader").show();
        }).catch(function(err) {
            console.error(err);
        });

    }



};

$(function() {
    $(window).load(function() {
        App.init();
    });
});