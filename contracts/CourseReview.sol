pragma solidity >=0.4.21 <0.7.0;

contract CourseReview{
    // model a condidate 
    struct Course{
      uint id;
      string name;
      uint voteCount;
      uint rating;
      //make a map of the students who have voted for the course

      mapping(address => bool) students;
      mapping(address => uint) ratings;
    }
    // store accounts that have voted
    
   // store a candiate 
   // fetch course 
    mapping(uint => Course) public courses;
    // store course count
   uint public coursesCount;

    constructor() public{
      addCourse("BlockChain Technology");
      addCourse("Machine Learning");
    }

    function addCourse (string memory _name) public {
      coursesCount++;
      //add a new course
      courses[coursesCount] = Course(coursesCount, _name, 0, 0);
      // courses[coursesCount] = Course(coursesCount,_name,0);
    }
    
    function vote (uint _courseId,uint _rating) public {
      // address has not voted before
      // require(!students[msg.sender]);
      // voting for valid course
      require(_courseId>0 && _courseId<=coursesCount);
      // update the voter has voted
      //rating must be between 1 and 5
      require(_rating>0 && _rating<=5);

      // students[msg.sender] = true;
      //update the votes of course
      //update the rating of the course
      //make a variable tempcourse
      Course memory tempCourse = courses[_courseId];
      // var tempCourse = courses[_courseId];
      uint tempCount = tempCourse.voteCount;
      uint tempRating = tempCourse.rating;
      tempRating = tempRating*tempCount ;
      // tempRating = tempRating + _rating;

      //if the student has voted before then the vote count should not be incremented

      if(!courses[_courseId].students[msg.sender]){
        tempCount++;
        courses[_courseId].students[msg.sender] = true;
        courses[_courseId].ratings[msg.sender] = _rating;
        tempRating = tempRating + _rating;
      }
      else{
        tempRating = tempRating - courses[_courseId].ratings[msg.sender] + _rating;
        courses[_courseId].ratings[msg.sender] = _rating;
      }
      //make a for loop to calculate the average rating of specific course
      // uint sum = 0;
      // uint count = 0;
      // for(uint i=1;i<=tempCount;i++){
      //   //make a for loop on ratings
      //   sum = sum + courses[_courseId].ratings[i];
      // }
    

      // tempCount++;
      tempRating = tempRating/tempCount;
      courses[_courseId] = Course(_courseId,tempCourse.name,tempCount,tempRating);
      // courses[_courseId].voteCount ++;
    }

}