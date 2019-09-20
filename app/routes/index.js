var express = require('express');
var cControllers = require('../controllers/controller')

var router = express.Router();

router.get('/', cControllers.showLandingPage)
router.post('/register', cControllers.register)
router.post('/signin', cControllers.signin)


router.post('/highestRevision', cControllers.highestRevision)
router.post('/lowestRevision', cControllers.lowestRevision)
router.post('/changedHighestRevision', cControllers.changedHighestRevision)
router.post('/changedLowestRevision', cControllers.changedLowestRevision)
router.post('/longestHistory', cControllers.longestHistory)
router.post('/shortestHistory', cControllers.shortestHistory)

router.post('/largestRegistered', cControllers.largestRegistered)
router.post('/smallestRegistered', cControllers.smallestRegistered)



//overall的可视化分析

router.post('/abc', cControllers.abc)




//文章分析

router.get('/findArticleName', cControllers.findArticleName)
router.post('/articleTotalRevisions', cControllers.articleTotalRevisions)
router.post('/showArticleSummary', cControllers.showArticleSummary)

//router.get('/selectUserByYear', cControllers.selectUserByYear)



//individual的可视化分析
router.post('/def', cControllers.def)
//select user
router.post('/singleUserRevisionDistribution', cControllers.singleUserRevisionDistribution)



//作者分析
router.get('/allAuthorNames', cControllers.allAuthorNames)
router.post('/articlesByAuthor', cControllers.articlesByAuthor)







module.exports=router;
