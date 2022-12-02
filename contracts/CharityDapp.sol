// SPDX-License-Identifier: MIT License
pragma solidity >=0.4.0 <0.7.0;

contract CharityDapp{
    struct Charity_Info{
      uint id;
      string name;
      string desc;
      uint num_donation;
      uint amt_collect;


      mapping(address => uint) amt;
    }
    
    mapping(uint => Charity_Info) public charities;
   uint public charity_num;

    constructor() public{
      addCharity("Charity 1","Default Charity");
    }

    function addCharity (string memory _name, string memory _desc) public {
      charity_num++;
      charities[charity_num] = Charity_Info(charity_num, _name,_desc, 0, 0);
    }
    
    function donate (uint _charity_ID,uint _donation) public {
      
      require(_charity_ID>0 && _charity_ID<=charity_num);
     
      require(_donation>0);

    
      Charity_Info memory tempcharity = charities[_charity_ID];
      
      uint tempCount = tempcharity.num_donation;
      uint tempdonation = tempcharity.amt_collect;
     

        tempCount++;
        tempdonation = tempdonation + _donation;
        charities[_charity_ID].amt[msg.sender] = tempdonation;
        
    
      charities[_charity_ID] = Charity_Info(_charity_ID,tempcharity.name,tempcharity.desc,tempCount,tempdonation);
    }

}