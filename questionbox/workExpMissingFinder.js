
// let skill = require('.././sectionskill/skillschema');
let workProcessor = require('.././sectionworkexperiance/workprocessor');
let qboxprocessor = require('./qboxprocessor');
let qboxquestionModel = require('./qboxquestions');

var getFieldsNames = function() { 
    return ['designation','workplace', 'Location'];
}   
    
var findWorkMissingFields = function(candidateid, successCB, errorCB) {
   workProcessor.getworkexp(candidateid, function(result) {
   	// console.log("------>project info---->",result[0]);
        let workInfo = result[0];

        let workFieldArray = getFieldsNames();
        // console.log("----->len"+projectInfo.projects.length);
        let sectionQBoxQuestions = [];
 
        for (let i = 0; i < workInfo.workexperience.length; i++) {
        	// console.log("hiii 1");
            let workData = workInfo.workexperience[i];

            for (let j = 0; j < workFieldArray.length; j++) {
            	// console.log("--->hii  2");
                if (workData[workFieldArray[j]] == '') {
                    let qboxquestion = new qboxquestionModel({
                        candidateid: candidateid,
                        section: "workexperience",
                        fieldname: workFieldArray[j],
                        instancename: workData.designation
                    });
                    //let it be the defualt, which is assumed to be pending
                    //let it be the defualt, which is assumed to be empty
                    sectionQBoxQuestions.push(qboxquestion);
                    // console.log("----->"+qboxquestion);      
                }
            } //end of looping through each field
        } // end of iterating through all the skills of the candiate 

 
        if (sectionQBoxQuestions.length > 0) {
            //insert to DB
            // qboxprocessor.insertPendindData(sectionQBoxQuestions,
            qboxprocessor.createNewQuestionColln(sectionQBoxQuestions,
                function(result) {
                    successCB(sectionQBoxQuestions);
                },
                function(err) {

                });

            //call qboxprocessor to insert these questions
        }
    }, function(err) {
        console.log("Error in finding missing fields for particular candidate ", err);
        errorCB(err);
    });
}

module.exports = {
    getFieldsNames: getFieldsNames,
    findWorkMissingFields: findWorkMissingFields
};