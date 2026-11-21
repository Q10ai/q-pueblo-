import {createBreakdown} from "./breakdown.mjs";
import {createLinear} from "./linear.mjs";
// Two complementary builds share the same IDs, source version and authority.
export function createKOSContext(packet,limits={}){
 const breakdown=createBreakdown(packet,limits);
 const linear=createLinear(breakdown,limits);
 return {breakdown,linear,releaseState:"HUMAN_REVIEW_REQUIRED"};
}
