import {createBreakdown} from "./breakdown.mjs";
import {createLinear} from "./linear.mjs";
import {createProduction} from "./production.mjs";
import {compileTwinShadow} from "./twin-shadow.mjs";
import {stageLearning} from "./learning-loop.mjs";
import {planExpertPanel,reconcileExpertReports} from "./expert-panel.mjs";
import {compileLEAP} from "./leap.mjs";
// Two complementary builds share the same IDs, source version and authority.
export function createKOSContext(packet,limits={}){
 const breakdown=createBreakdown(packet,limits);
 const linear=createLinear(breakdown,limits);
 const production=createProduction({breakdown,linear},packet.productionInputs||{});
 // Deliberately *not* merged into production: models, shadows and learning
 // candidates are internal analysis, not public evidence or authority.
 const expertPlan=planExpertPanel(breakdown,packet.expertPanelInputs?.plan||{});
 const expertReviews=reconcileExpertReports(breakdown,expertPlan,packet.expertPanelInputs?.reports||[]);
 const internalOnly={
   twinShadow:compileTwinShadow(breakdown,packet.twinShadowInputs||{}),
   expertPanel:{plan:expertPlan,reviews:expertReviews},
   learning:stageLearning(breakdown,packet.learningCandidates||[]),
   leap:compileLEAP(breakdown,packet.leapCandidates||[])
 };
 return {breakdown,linear,production,internalOnly,releaseState:"HUMAN_REVIEW_REQUIRED"};
}
