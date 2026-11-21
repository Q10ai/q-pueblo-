import {createBreakdown} from "./breakdown.mjs";
import {createLinear} from "./linear.mjs";
import {createProduction} from "./production.mjs";
// Two complementary builds share the same IDs, source version and authority.
export function createKOSContext(packet,limits={}){
 const breakdown=createBreakdown(packet,limits);
 const linear=createLinear(breakdown,limits);
 const production=createProduction({breakdown,linear},packet.productionInputs||{});
 return {breakdown,linear,production,releaseState:"HUMAN_REVIEW_REQUIRED"};
}
