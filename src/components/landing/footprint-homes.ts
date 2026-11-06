/** Vector carbon-footprint stencil sampled into a shallow 3D particle sculpture. */
export function createFootprintHomes(count: number) {
  const canvas=document.createElement("canvas");canvas.width=800;canvas.height=450;
  const ctx=canvas.getContext("2d",{willReadFrequently:true})!;
  ctx.fillStyle="white";
  // Toe pads sit on the left; broad forefeet taper into rounded heels on the right.
  ctx.fill(new Path2D("M328 62 C350 32 386 36 417 66 C468 112 560 112 653 139 C697 151 708 184 683 208 C659 232 618 224 581 206 C512 177 461 176 410 195 C353 217 311 198 307 160 C301 125 310 89 328 62Z"));
  ctx.fill(new Path2D("M188 235 C212 200 254 202 289 233 C329 272 404 284 509 298 C559 305 571 341 550 369 C527 397 480 386 438 379 C368 367 315 368 267 378 C218 388 181 368 171 333 C161 300 169 263 188 235Z"));
  const toes=[[280,166,32,23],[292,115,27,21],[317,80,23,18],[343,52,18,15],[371,30,15,13],[146,228,34,23],[135,271,28,21],[146,313,22,18],[164,345,18,15],[188,372,15,12]];
  for(const [x,y,rx,ry] of toes){ctx.beginPath();ctx.ellipse(x,y,rx,ry,.30,0,Math.PI*2);ctx.fill();}
  // Negative-space lettering remains legible without an opaque image layer.
  ctx.globalCompositeOperation="destination-out";
  ctx.font="bold 52px Arial";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.save();ctx.translate(504,145);ctx.rotate(.14);ctx.fillText("CARBON",0,0);ctx.restore();
  ctx.font="bold 46px Arial";ctx.save();ctx.translate(367,321);ctx.rotate(.10);ctx.fillText("FOOTPRINT",0,0);ctx.restore();
  const pixels=ctx.getImageData(0,0,800,450).data;
  const occupied:number[]=[];
  for(let y=0;y<450;y++)for(let x=0;x<800;x++)if(pixels[(y*800+x)*4+3]>180)occupied.push(y*800+x);
  const points=new Float32Array(count*4);
  for(let i=0;i<count;i++){
    const pixel=occupied[Math.floor(Math.random()*occupied.length)];
    points[i*4]=((pixel%800+Math.random())/800-.5)*3.0;
    points[i*4+1]=(.5-(Math.floor(pixel/800)+Math.random())/450)*1.69;
    points[i*4+2]=(Math.random()-.5)*.085;
    points[i*4+3]=1;
  }
  return points;
}
