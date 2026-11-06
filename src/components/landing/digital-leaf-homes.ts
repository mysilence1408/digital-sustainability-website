/** A folded digital leaf: organic silhouette, ordered data ridges and branching traces. */
export function createDigitalLeafHomes(count: number) {
  const homes=new Float32Array(count*4);
  for(let i=0;i<count;i++){
    const phase=Math.random();
    const group=Math.random();
    let t=phase,across=Math.random()*2-1;
    const side=across<0?-1:1;
    if(group<.17){
      // A continuous central spine, drawn from the root towards the tip.
      across=(Math.random()-.5)*.024;
    }else if(group<.43){
      // Ten pairs of traces branch from the spine and follow the leaf's curvature.
      const branch=Math.min(9,Math.floor(phase*10));
      const progress=(phase*10)%1;
      const base=.07+branch*.079;
      t=base+progress*.13;
      across=side*progress*.91;
      across+=(Math.random()-.5)*.012;
    }else if(group<.51){
      across=side*(.985+Math.random()*.015);
    }else if(group<.96){
      // Quiet, closely spaced ribbons provide structure instead of a solid fill.
      across=Math.round(across*32)/32+(Math.random()-.5)*.007;
    }else{
      // Small beads mark the trace terminals; no floating labels or extra icons.
      const branch=Math.min(9,Math.floor(phase*10));
      t=.07+branch*.079+.13+(Math.random()-.5)*.008;
      across=side*.91+(Math.random()-.5)*.018;
    }
    t=Math.max(0,Math.min(1,t));
    const width=.67*Math.pow(Math.sin(Math.PI*t),.90)*(1.04-.17*t);
    const lateral=across*width;
    const x=-1.30+t*2.60;
    const y=-.57+t*1.11+.12*Math.sin(Math.PI*t);
    const arch=.27*Math.sin(Math.PI*t);
    const fold=.20*Math.abs(across)*Math.sin(Math.PI*t);
    const twist=.16*across*Math.sin(t*Math.PI*1.4);
    homes[i*4]=x-lateral*.40;
    homes[i*4+1]=y+lateral*.916;
    homes[i*4+2]=arch-fold+twist+(Math.random()-.5)*.018;
    homes[i*4+3]=t;
  }
  return homes;
}
