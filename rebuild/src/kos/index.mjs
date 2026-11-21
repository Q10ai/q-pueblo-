import {createBreakdown} from "./breakdown.mjs";
import {createLinear} from "./linear.mjs";
import {createProduction} from "./production.mjs";
import {compileTwinShadow} from "./twin-shadow.mjs";
import {stageLearning} from "./learning-loop.mjs";
// Two complementary builds share the same IDs, source version and authority.
export function createKOSContext(packet,limits={}){
 const breakdown=createBreakdown(packet,limits);
 const linear=createLinear(breakdown,limits);
 const production=createProduction({breakdown,linear},packet.productionInputs||{});
 // Deliberately *not* merged into production: models, shadows and learning
 // candidates are internal analysis, not public evidence or authority.
 const internalOnly={
   twinShadow:compileTwinShadow(breakdown,packet.twinShadowInputs||{}),
   learning:stageLearning(breakdown,packet.learningCandidates||[])
 };
 return {breakdown,linear,production,internalOnly,releaseState:"HUMAN_REVIEW_REQUIRED"};
}
