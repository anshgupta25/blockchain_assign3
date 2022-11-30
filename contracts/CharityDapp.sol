// SPDX-License-Identifier: MIT License

pragma solidity >=0.4.0 <0.7.0;

contract CharityDapp{
    // model a condidate 
    struct Charity_Info{
      uint id;
      string name;
      string desc;
      uint num_donation;
      uint amt_collect;
      //make a map of the students who have donated for the Charity_Info

      mapping(address => bool) students;
      mapping(address => uint) amt;
    }
    // store accounts that have donated
    
   // store a candiate 
   // fetch Charity_Info 
    mapping(uint => Charity_Info) public charities;
    // store Charity_Info count
   uint public charity_num;

    constructor() public{
      addCharity("Charity 1","Default Charity");
    }

    function addCharity (string memory _name, string memory _desc) public {
      charity_num++;
      //add a new Charity_Info
      charities[charity_num] = Charity_Info(charity_num, _name,_desc, 0, 0);
      // charities[charity_num] = Charity_Info(charity_num,_name
    }
    
    function donate (uint _charity_ID,uint _donation) public {
      // address has not donated before
      // require(!students[msg.sender]);
      // voting for valid Charity_Info
      require(_charity_ID>0 && _charity_ID<=charity_num);
      // update the donater has donated
      //amt_collect must be between 1 and 5
      require(_donation>0);

      // students[msg.sender] = true;
      //update the donates of Charity_Info
      //update the amt_collect of the Charity_Info
      //make a variable tempcharity
      Charity_Info memory tempcharity = charities[_charity_ID];
      // var tempcharity = charities[_charity_ID];
      uint tempCount = tempcharity.num_donation;
      uint tempdonation = tempcharity.amt_collect;
      // tempdonation = tempdonation + _donation;

      //if the student has donated before then the donate count should not be incremented

        tempCount++;
        charities[_charity_ID].students[msg.sender] = true;
        tempdonation = tempdonation + _donation;
        charities[_charity_ID].amt[msg.sender] = tempdonation;
        
    
      //make a for loop to calculate the average amt_collect of specific Charity_Info
      // uint sum = 0;
      // uint count = 0;
      // for(uint i=1;i<=tempCount;i++){
      //   //make a for loop on amt
      //   sum = sum + charities[_charity_ID].amt[i];
      // }
    

      // tempCount++;
      charities[_charity_ID] = Charity_Info(_charity_ID,tempcharity.name,tempcharity.desc,tempCount,tempdonation);
      // charities[_charity_ID].num_donation ++;
    }

}