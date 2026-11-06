/** Dense aerial forest with a leaf-shaped clearing and foliage CO2 lettering. */
export function createForestHomes(count: number) {
  const size=800;
  const stencil=document.createElement("canvas");stencil.width=size;stencil.height=600;
  const ctx=stencil.getContext("2d",{willReadFrequently:true})!;
  ctx.fillStyle="white";ctx.beginPath();ctx.roundRect(32,24,736,552,82);ctx.fill();
  ctx.globalCompositeOperation="destination-out";
  // A broad diagonal leaf clearing, with a forest vein left running through it.
  ctx.fill(new Path2D("M230 452 C152 281 315 169 570 105 C531 304 409 457 230 452Z"));
  ctx.globalCompositeOperation="source-over";
  ctx.strokeStyle="white";ctx.lineWidth=17;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(194,489);ctx.bezierCurveTo(242,385,344,278,447,219);ctx.stroke();
  ctx.font="bold 66px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("CO",383,365);
  ctx.font="bold 42px Arial";ctx.fillText("2",456,381);
  const mask=ctx.getImageData(0,0,size,600).data;
  const inside=(x:number,y:number)=>x>=0&&x<800&&y>=0&&y<600&&mask[(Math.floor(y)*800+Math.floor(x))*4+3]>180;
  const centers:{x:number;y:number;radius:number;height:number}[]=[];
  // Closely spaced, overlapping crowns keep the forest dense rather than dotted.
  for(let row=0;row<48;row++)for(let col=0;col<64;col++){
    const x=(col+.5)*12.5+(Math.random()-.5)*5;
    const y=(row+.5)*12.5+(Math.random()-.5)*5;
    if(inside(x,y))centers.push({x,y,radius:8+Math.random()*6,height:.035+Math.random()*.10});
  }
  const homes=new Float32Array(count*4);
  for(let i=0;i<count;i++){
    const phase=Math.random();
    const center=centers[Math.min(centers.length-1,Math.floor(phase*centers.length))];
    let x=center.x,y=center.y;
    const angle=Math.random()*Math.PI*2;
    const v=Math.random()*2-1;
    const radius=Math.sqrt(Math.max(0,1-v*v))*center.radius;
    const testX=x+Math.cos(angle)*radius,testY=y+Math.sin(angle)*radius;
    if(inside(testX,testY)){x=testX;y=testY;}
    homes[i*4]=(x/800-.5)*3.05;
    homes[i*4+1]=(.5-y/600)*2.22;
    homes[i*4+2]=center.height+v*.045+.018*Math.sin(angle*7.);
    homes[i*4+3]=phase;
  }
  return homes;
}
