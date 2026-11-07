"use client";

import { useEffect, useRef } from "react";

const colors = ["#ff6a4a", "#ffb727", "#d364dc", "#00b8aa", "#39ce66", "#EF6905"];
const labels = ["Leaf", "Carbon dioxide", "Data storage", "Cloud", "Reuse", "Energy"];

export default function FooterSymbols() {
  const ref=useRef<HTMLCanvasElement>(null);
  const layer=useRef<HTMLDivElement>(null);
  const controls=useRef<(HTMLButtonElement|null)[]>([]);
  useEffect(()=>{
    const canvas=ref.current!,host=layer.current!,ctx=canvas.getContext("2d");
    if(!ctx)return;
    const footer=host.closest("footer")!;
    const motion=matchMedia("(prefers-reduced-motion: reduce)");
    let width=1,height=1,frame=0,last=0,visible=false,disposed=false,initialized=false,accumulator=0;
    let grabbed=-1,pointerId:number|null=null,offsetX=0,offsetY=0,lastPointerTime=0,lastMove=0;
    const bodies=colors.map((color,i)=>({color,x:0,y:0,vx:0,vy:0,r:40,angle:(i-2)*.16,spin:0,bound:40,mass:1}));
    const paint=()=>{
      ctx.clearRect(0,0,width,height);
      bodies.forEach((b, index) => {
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.angle);
        ctx.fillStyle = b.color; ctx.beginPath(); ctx.roundRect(-b.r, -b.r, b.r * 2, b.r * 2, index % 3 === 0 ? b.r : b.r * .28); ctx.fill();
        ctx.strokeStyle = "#1c3027"; ctx.fillStyle = "#1c3027"; ctx.lineWidth = Math.max(1.5, b.r * .045); ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.scale(b.r / 40, b.r / 40);
        if (index === 0) {
          ctx.beginPath();ctx.moveTo(-16,19);ctx.bezierCurveTo(-27,-7,-6,-25,22,-20);ctx.bezierCurveTo(22,7,10,24,-16,19);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,24);ctx.lineTo(13,-12);ctx.moveTo(-6,8);ctx.lineTo(-12,-6);ctx.moveTo(2,-2);ctx.lineTo(16,-1);ctx.stroke();
        } else if (index === 1) {
          ctx.font = "500 28px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("CO",-3,0);ctx.font="14px Arial";ctx.fillText("2",25,11);
        } else if (index === 2) {
          ctx.beginPath();ctx.roundRect(-23,-16,46,32,5);ctx.moveTo(-13,-6);ctx.lineTo(13,-6);ctx.moveTo(-13,4);ctx.lineTo(6,4);ctx.moveTo(14,4);ctx.lineTo(14,4.1);ctx.stroke();
        } else if (index === 3) {
          ctx.beginPath();ctx.moveTo(-21,13);ctx.bezierCurveTo(-37,5,-24,-12,-13,-7);ctx.bezierCurveTo(-14,-28,16,-29,20,-10);ctx.bezierCurveTo(37,-10,36,14,21,14);ctx.closePath();ctx.stroke();
        } else if (index === 4) {
          ctx.beginPath();ctx.arc(0,0,17,-.3,Math.PI*1.6);ctx.moveTo(5,-22);ctx.lineTo(15,-18);ctx.lineTo(9,-9);ctx.moveTo(-5,22);ctx.lineTo(-15,18);ctx.lineTo(-9,9);ctx.stroke();
        } else {
          ctx.beginPath();ctx.moveTo(4,-25);ctx.lineTo(-17,4);ctx.lineTo(-1,4);ctx.lineTo(-4,25);ctx.lineTo(18,-6);ctx.lineTo(2,-6);ctx.closePath();ctx.stroke();
        }
        ctx.restore();
        const button=controls.current[index];
        if(button){
          button.style.width=`${b.r*2}px`;button.style.height=`${b.r*2}px`;
          button.style.transform=`translate3d(${b.x-b.r}px,${b.y-b.r}px,0) rotate(${b.angle}rad)`;
          button.style.visibility="visible";
        }
      });
    };

    const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
    const walls=()=>bodies.forEach((b,index)=>{
      if(index===grabbed)return;
      if(b.x<b.bound){b.x=b.bound;b.vx=Math.abs(b.vx)*.72;}
      if(b.x>width-b.bound){b.x=width-b.bound;b.vx=-Math.abs(b.vx)*.72;}
      if(b.y<b.bound){b.y=b.bound;b.vy=Math.abs(b.vy)*.72;}
      if(b.y>height-b.bound){b.y=height-b.bound;b.vy=-Math.abs(b.vy)*.64;b.vx*=.985;if(Math.abs(b.vy)<12)b.vy=0;}
    });
    const resize=new ResizeObserver(([entry])=>{
      const oldWidth=width,oldHeight=height;
      width=entry.contentRect.width;height=entry.contentRect.height;
      const dpr=Math.min(devicePixelRatio||1,1.5);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      const home=footer.querySelector<HTMLElement>("[data-footer-symbol-home]")?.getBoundingClientRect();
      const bounds=footer.getBoundingClientRect();
      bodies.forEach((b,i)=>{
        b.r=Math.min(65,Math.max(22,(width-40)/16));b.bound=b.r*(i%3===0?1:1.30);b.mass=b.r*b.r;
        b.x=initialized?clamp(b.x/oldWidth*width,b.bound,width-b.bound):width*(i+.65)/6.2;
        b.y=initialized?clamp(b.y/oldHeight*height,b.bound,height-b.bound):(home?home.bottom-bounds.top-b.bound-8:height*.7);
        b.vx=0;b.vy=0;
      });initialized=true;walls();paint();
    });resize.observe(host);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;accumulator=0;});observer.observe(host);
    const coordinates=(e:PointerEvent)=>{const rect=host.getBoundingClientRect();return {x:e.clientX-rect.left,y:e.clientY-rect.top};};
    const down=(e:PointerEvent)=>{
      if(grabbed>=0||e.button!==0)return;
      const target=(e.target as HTMLElement).closest<HTMLButtonElement>("[data-footer-symbol]");
      if(!target)return;
      grabbed=Number(target.dataset.footerSymbol);pointerId=e.pointerId;
      const point=coordinates(e),b=bodies[grabbed];offsetX=b.x-point.x;offsetY=b.y-point.y;
      b.vx=0;b.vy=0;lastPointerTime=e.timeStamp;lastMove=performance.now();
      target.setPointerCapture(e.pointerId);target.style.cursor="grabbing";
      e.preventDefault();
    };
    const move=(e:PointerEvent)=>{
      if(grabbed<0||e.pointerId!==pointerId)return;
      const b=bodies[grabbed],point=coordinates(e);
      const x=clamp(point.x+offsetX,b.bound,width-b.bound),y=clamp(point.y+offsetY,b.bound,height-b.bound);
      const dt=Math.max(.008,(e.timeStamp-lastPointerTime)/1000);
      b.vx=clamp((x-b.x)/dt,-1700,1700);b.vy=clamp((y-b.y)/dt,-1700,1700);
      b.x=x;b.y=y;b.spin=b.vx*.0009;
      lastPointerTime=e.timeStamp;lastMove=performance.now();paint();
      e.preventDefault();
    };
    const release=(e:PointerEvent)=>{
      if(grabbed<0||e.pointerId!==pointerId)return;
      const button=controls.current[grabbed],b=bodies[grabbed];
      if(e.type==="pointercancel"||performance.now()-lastMove>100||motion.matches){b.vx=0;b.vy=0;}
      grabbed=-1;pointerId=null;
      if(button){button.style.cursor="grab";if(button.hasPointerCapture(e.pointerId))button.releasePointerCapture(e.pointerId);}
    };
    const keydown=(e:KeyboardEvent)=>{
      const target=(e.target as HTMLElement).closest<HTMLButtonElement>("[data-footer-symbol]");if(!target)return;
      const direction:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
      const delta=direction[e.key];if(!delta)return;e.preventDefault();
      const b=bodies[Number(target.dataset.footerSymbol)];
      b.x=clamp(b.x+delta[0]*30,b.bound,width-b.bound);b.y=clamp(b.y+delta[1]*30,b.bound,height-b.bound);
      if(!motion.matches){b.vx+=delta[0]*240;b.vy+=delta[1]*240;}paint();
    };
    const step=(dt:number)=>{
      bodies.forEach((b,index)=>{
        if(index===grabbed)return;
        b.vy+=260*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.angle+=b.spin*dt;
        b.vx*=Math.exp(-.22*dt);b.spin*=Math.exp(-.7*dt);
      });
      // Equal/opposite impulses conserve momentum and propagate chain impacts.
      // A held shape is kinematic, transferring its measured drag velocity.
      for(let pass=0;pass<3;pass++){
        for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
          const a=bodies[i],b=bodies[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),limit=a.bound+b.bound;
          if(d>=limit)continue;
          const nx=d>.001?dx/d:1,ny=d>.001?dy/d:0;
          const ia=i===grabbed?0:1/a.mass,ib=j===grabbed?0:1/b.mass,total=ia+ib;
          if(!total)continue;
          const correction=Math.max(0,limit-d-.1)*.8/total;
          a.x-=nx*correction*ia;a.y-=ny*correction*ia;b.x+=nx*correction*ib;b.y+=ny*correction*ib;
          const closing=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
          if(closing<0){
            const impulse=-(1+.78)*closing/total;
            a.vx-=impulse*nx*ia;a.vy-=impulse*ny*ia;b.vx+=impulse*nx*ib;b.vy+=impulse*ny*ib;
            if(i!==grabbed)a.spin-=ny*impulse*ia*.007;if(j!==grabbed)b.spin+=ny*impulse*ib*.007;
          }
        }
        walls();
      }
    };
    const tick=(stamp:number)=>{
      if(disposed)return;frame=requestAnimationFrame(tick);
      if(!visible||document.hidden||motion.matches){last=0;accumulator=0;return;}
      accumulator+=last?Math.min(.05,(stamp-last)/1000):1/60;last=stamp;
      if(grabbed>=0&&performance.now()-lastMove>100){bodies[grabbed].vx=0;bodies[grabbed].vy=0;}
      while(accumulator>=1/120){step(1/120);accumulator-=1/120;}paint();
    };
    const changed=()=>{bodies.forEach(b=>{b.vx=0;b.vy=0;b.spin=0;});last=0;paint();};
    host.addEventListener("pointerdown",down);window.addEventListener("pointermove",move,{passive:false});window.addEventListener("pointerup",release);window.addEventListener("pointercancel",release);host.addEventListener("keydown",keydown);motion.addEventListener("change",changed);
    frame=requestAnimationFrame(tick);
    return ()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();host.removeEventListener("pointerdown",down);window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",release);window.removeEventListener("pointercancel",release);host.removeEventListener("keydown",keydown);motion.removeEventListener("change",changed);};
  },[]);
  return <div ref={layer} className="pointer-events-none absolute inset-0 z-20">
    <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block size-full" />
    {labels.map((label,index)=><button key={label} ref={element=>{controls.current[index]=element;}} data-footer-symbol={index} type="button" aria-label={`${label} symbol. Drag to move or use arrow keys.`} className="pointer-events-auto absolute left-0 top-0 invisible cursor-grab touch-none rounded-[28%] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" />)}
  </div>;
}
