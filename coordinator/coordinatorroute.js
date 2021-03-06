var router = require('express').Router();
var coordinatorprocessor = require('./coordinatorprocessor');
var coordinator = require('./coordinatorschema');
var circleProcessor = require('../circlesBackEnd/circleProcessor');


router.post('/createcoordinator', function(req, res) {
    console.log("inside post request", req.body.mobile);
    try {

        coordinator.findOne({
            "coordinatorId": req.body.mobile
        }, function(err, crdntrObj) {
            if (err) {
                return res.send({ error: 'Something went wrong, please report' });
            }

            if (crdntrObj) {
                //Already exists
                console.log("Coordinator already exists ", crdntrObj);
            } else {
                //Does not exists
                coordinatorprocessor.createCoordinator(req.body,
                    function(coordinatorObj) {
                        return coordinatorObj;
                    },
                    function(err) {
                        return err;
                    });

                //for nepo4j rellation
                console.log("create coordinatior request");
                var circle = {
                    name: req.body.profession,
                    domain: "profession",
                    circleType: 'Profiling',
                    visuality: 'shared'
                }


                circleProcessor.circlePost(circle,
                    function errorCB(err) {
                        if (err) {
                            console.log("Error occurred in circle posting ", err);
                            return res.status(500).json({ error: "Something went wrong internally, please try later or report issue" });
                        }
                    });
                circleProcessor.createRelation(req.body, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("inside the function create relation");
                });

                coordinatorprocessor.insertCoordinator(req.body,
                    function(err, user) {
                        if (err) {

                            // return res.status(500).json({
                            error: "Internal error in processing request, please retry later..!";

                        }

                        return res.status(200).json(user);

                    },
                    function(err) {
                        return res.status(403).json(err);
                    }); //insertCoordinator ends
            }
        });
    } catch (err) {
        console.log("Error occurred in creating new coordinator : ", err);

    } //end c

});

module.exports = router;
