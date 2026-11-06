/** A procedural carbon-footprint emblem; every point remains a stable GPU home. */
export function carbonFootprintPoint(phase: number, random: () => number): [number, number, number] {
  const angle=random()*Math.PI*2;
  const tube=(radius: number): [number,number,number] => [Math.cos(angle)*radius,Math.sin(angle)*radius,(random()-.5)*radius];
  if(phase<.12){
    const t=phase/.12;
    return [.025*Math.sin(t*3)+.024*Math.cos(angle),-1.04+t*1.45,.024*Math.sin(angle)];
  }
  if(phase<.64){
    const local=(phase-.12)/.52*6;
    const leaf=Math.min(5,Math.floor(local)), t=local-leaf;
    const side=leaf%2===0?-1:1;
    const tier=Math.floor(leaf/2);
    const length=[.72,.70,.56][tier];
    const width=.20*Math.pow(Math.sin(Math.PI*t),.85);
    const cross=(random()*2-1)*width;
    const along=t*length;
    const base=-.67+tier*.42;
    const vein=random()<.12;
    return [side*(along*.89-(vein?0:cross)*.43),base+along*.52+(vein?0:cross)*.89,.12*Math.sin(t*Math.PI)+(vein?0:(random()-.5)*.05)];
  }
  if(phase<.82){
    const t=(phase-.64)/.18;
    const radius=.009+random()*.009;
    const d=tube(radius);
    // C and O are curved strokes; the small 2 sits on the baseline.
    if(t<.38){const a=.30*Math.PI+t/.38*1.40*Math.PI;return [-.40+.16*Math.cos(a)+d[0],.88+.21*Math.sin(a)+d[1],d[2]];}
    if(t<.76){const a=(t-.38)/.38*Math.PI*2;return [-.025+.16*Math.cos(a)+d[0],.88+.21*Math.sin(a)+d[1],d[2]];}
    const path=[[.20,.77],[.23,.81],[.29,.81],[.32,.77],[.30,.73],[.21,.65],[.33,.65]];
    const u=(t-.76)/.24*(path.length-1),i=Math.min(path.length-2,Math.floor(u)),f=u-i;
    return [path[i][0]*(1-f)+path[i+1][0]*f+d[0],path[i][1]*(1-f)+path[i+1][1]*f+d[1],d[2]];
  }
  if(phase<.94){
    const a=(phase-.82)/.12*Math.PI*2;
    // Delicate orbit frames the sprout without overpowering its silhouette.
    return [1.13*Math.cos(a)+.006*Math.cos(angle),.04+1.27*Math.sin(a),-.12+.006*Math.sin(angle)];
  }
  const local=(phase-.94)/.06;
  const side=local<.5?-1:1;
  const t=(local*2)%1;
  let x,y;
  if(t<.66){const a=t/.66*Math.PI*2;x=.052*Math.cos(a);y=.093*Math.sin(a);}
  else {const toe=Math.min(4,Math.floor((t-.66)/.34*5));x=(toe-2)*.024+.013*Math.cos(angle);y=.11+.035*Math.sin(toe/4*Math.PI)+.015*Math.sin(angle);}
  return [.56+side*.065+x,.92+y+side*.045,.01+(random()-.5)*.015];
}
