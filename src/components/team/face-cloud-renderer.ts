/** Original transparent head cutouts, lit and scanned without facial reconstruction. */
export function createFaceCloud(canvas: HTMLCanvasElement, images: HTMLImageElement[], getMember: () => number) {
  const gl=canvas.getContext("webgl2",{alpha:true,antialias:false});
  if(!gl){canvas.dataset.renderer="unavailable";return ()=>{};}
  const vertex=`#version 300 es
precision highp float;
uniform vec2 viewport,gaze;
uniform float grid,progress,aspectBefore,aspectAfter,particles,dpr,time,reduced,entrance;
out vec2 uv;
float hash(float n){return fract(sin(n)*43758.5453);}
void main(){
 float id=float(gl_VertexID);
 if(particles>.5){
   float row=floor(id/grid);
   uv=(vec2(mod(id,grid)+mod(row,2.)*.5,row)+.5)/grid;
 }
 else{vec2 corners[6]=vec2[6](vec2(0,0),vec2(1,0),vec2(0,1),vec2(0,1),vec2(1,0),vec2(1,1));uv=corners[gl_VertexID];}
 float aspect=mix(aspectBefore,aspectAfter,smoothstep(0.,1.,progress));
 vec2 p=vec2((uv.x-.5)*2.*aspect,(.5-uv.y)*2.);
 // Stable UV homes preserve facial features; only the transition scatters them.
 float delay=hash(id+29.)*.20;
 float travel=smoothstep(delay,delay+.78,progress);
 float burst=sin(travel*3.14159265)*(1.-reduced);
 if(particles>.5){
   vec2 direction=vec2(hash(id+13.)-.5,hash(id+7.)-.5);
   float turn=burst*.7;
   direction=mat2(cos(turn),-sin(turn),sin(turn),cos(turn))*direction;
   p+=direction*burst*1.05;
 }
 float gathered=smoothstep(1.-uv.y,1.-uv.y+.12,entrance*1.12);
 if(particles>.5){p.y=mix(-1.,p.y,gathered);}
 float fit=min(viewport.x/(aspect*2.)*.87,viewport.y*.43);
 // Move the portrait as a whole: no inferred facial geometry or feature warping.
 p.x+=gaze.x*.045*(1.-reduced);
 p.y+=gaze.y*.012*(1.-reduced);
 gl_Position=vec4(p*fit/viewport*2.,0.,1.);
 gl_PointSize=clamp((1.45+hash(id+3.)*.45+burst*.65)*dpr,1.,4.);
}`;
  const fragment=`#version 300 es
precision highp float;
uniform sampler2D beforeFace,afterFace;
uniform float progress,particles,time,scanTime,reduced,grid,entrance;
in vec2 uv;out vec4 result;
void main(){
 vec4 a=texture(beforeFace,uv),b=texture(afterFace,uv);
 float row=floor(uv.y*grid);
 float id=row*grid+floor(uv.x*grid-mod(row,2.)*.5);
 float delay=fract(sin(id+29.)*43758.5453)*.20;
 float travel=smoothstep(delay,delay+.78,progress);
 // Premultiplied interpolation avoids dark fringes around transparent hair.
 vec4 face=mix(vec4(a.rgb*a.a,a.a),vec4(b.rgb*b.a,b.a),travel);
 float gathered=smoothstep(1.-uv.y,1.-uv.y+.12,entrance*1.12);
 if(face.a<.005||gathered<=0.)discard;
 vec3 rgb=face.rgb/max(face.a,.001);
 float l=dot(rgb,vec3(.2126,.7152,.0722));
 // Blue-white silver, with no remaining skin or clothing hue.
 float silver=pow(l,.80);
 vec3 ink=mix(vec3(.055,.11,.17),vec3(.88,.96,1.),silver);
 float scan=exp(-pow((fract(scanTime*.115)-uv.y)/.018,2.))*(1.-reduced);
 float key=exp(-pow((uv.x-.23)/.30,2.));
 float light=.40+1.70*key+.035*sin(time*.55+uv.x*2.)*(1.-reduced)+scan*.50;
 float burst=sin(progress*3.14159265)*(1.-reduced);
 // The faint detail layer vanishes during breakup, so the portrait really
 // becomes disconnected pieces instead of leaving a solid photo underneath.
 float alpha=face.a*(particles>.5?(.45+silver*.52):.07*pow(1.-burst,6.));
 if(particles>.5){vec2 q=gl_PointCoord*2.-1.;alpha*=1.-smoothstep(.50,1.,dot(q,q));}
 alpha*=gathered;
 float leadingEdge=exp(-pow((entrance*1.12-(1.-uv.y))/.025,2.))*(1.-step(.999,entrance));
 ink=ink*light+scan*.035+leadingEdge*.24;
 // A fluorescent-tube start: two uneven dimming pulses, then a steady image.
 // Bursts are infrequent, never black out the face, and avoid member transitions.
 float cycle=floor(time/10.3);
 float variation=fract(sin(cycle*17.13+3.1)*43758.5453);
 float age=mod(time,10.3)-(4.4+variation*1.8);
 float first=smoothstep(-.025,0.,age)*(1.-smoothstep(.075,.115,age));
 float second=smoothstep(.34,.375,age)*(1.-smoothstep(.49,.55,age));
 float flutter=(first*.42+second*.26)*(1.-reduced)*step(.999,entrance)*step(.999,progress);
 ink*=1.-flutter;
 result=vec4(ink*alpha,alpha);
}`;
  const program=gl.createProgram()!,vao=gl.createVertexArray();
  const shaders:WebGLShader[]=[],textures:WebGLTexture[]=[];
  let disposed=false,frame=0,visible=true,width=1,height=1,dpr=1,last=0,time=0,progress=1,current=getMember(),previous=current,dirty=true;
  let entranceStartedAt:number|null=null;
  let scanTime=0;
  const motion=matchMedia("(prefers-reduced-motion: reduce)");
  const pointer={x:0,y:0,targetX:0,targetY:0};
  const leave=()=>{pointer.targetX=0;pointer.targetY=0;};
  const move=(event:PointerEvent)=>{
    if(event.pointerType!=="mouse"||motion.matches){leave();return;}
    const rect=canvas.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){leave();return;}
    pointer.targetX=(event.clientX-rect.left)/rect.width*2-1;
    pointer.targetY=1-(event.clientY-rect.top)/rect.height*2;
  };
  const resize=new ResizeObserver(([entry])=>{width=entry.contentRect.width;height=entry.contentRect.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);dirty=true;});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;dirty=true;});
  const changed=()=>{dirty=true;last=0;leave();pointer.x=0;pointer.y=0;};
  const cleanup=()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();motion.removeEventListener("change",changed);window.removeEventListener("pointermove",move);window.removeEventListener("blur",leave);document.documentElement.removeEventListener("pointerleave",leave);textures.forEach(t=>gl.deleteTexture(t));shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);gl.deleteVertexArray(vao);};
  try{
    for(const [type,code] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]] as const){const shader=gl.createShader(type)!;shaders.push(shader);gl.shaderSource(shader,code);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)??"Portrait shader failed");gl.attachShader(program,shader);}
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)??"Portrait link failed");
    gl.useProgram(program);gl.bindVertexArray(vao);
    images.forEach(image=>{const texture=gl.createTexture()!;textures.push(texture);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);});
    const uniforms=Object.fromEntries(["beforeFace","afterFace","viewport","gaze","grid","time","scanTime","progress","aspectBefore","aspectAfter","particles","dpr","reduced","entrance"].map(name=>[name,gl.getUniformLocation(program,name)]));
    const grid=matchMedia("(max-width:767px)").matches?172:260;
    resize.observe(canvas);observer.observe(canvas);motion.addEventListener("change",changed);
    window.addEventListener("pointermove",move,{passive:true});window.addEventListener("blur",leave);document.documentElement.addEventListener("pointerleave",leave);
    const render=(stamp:number)=>{
      if(disposed)return;frame=requestAnimationFrame(render);
      if(!visible||document.hidden){last=0;return;}
      if(getMember()!==current){previous=current;current=getMember();progress=0;scanTime=0;dirty=true;}
      if(motion.matches&&!dirty)return;
      const delta=last?Math.min(.1,(stamp-last)/1000):1/60;last=stamp;
      const follow=1-Math.exp(-delta*6);
      pointer.x+=(pointer.targetX-pointer.x)*follow;
      pointer.y+=(pointer.targetY-pointer.y)*follow;
      entranceStartedAt ??= stamp;
      const entrance=motion.matches?1:Math.min(1,(stamp-entranceStartedAt)/1800);
      if(!motion.matches){time+=delta;scanTime+=delta;}
      progress=motion.matches?1:Math.min(1,progress+delta/1.8);
      gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.bindVertexArray(vao);
      for(const [unit,index] of [[0,previous],[1,current]]){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[index]);}
      gl.uniform1i(uniforms.beforeFace,0);gl.uniform1i(uniforms.afterFace,1);gl.uniform2f(uniforms.viewport,width,height);
      gl.uniform2f(uniforms.gaze,pointer.x,pointer.y);
      for(const [name,value] of [["time",time],["scanTime",scanTime],["progress",progress],["grid",grid],["aspectBefore",images[previous].naturalWidth/images[previous].naturalHeight],["aspectAfter",images[current].naturalWidth/images[current].naturalHeight],["dpr",dpr],["reduced",motion.matches?1:0],["entrance",entrance]] as const)gl.uniform1f(uniforms[name],value);
      gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(uniforms.particles,0);gl.drawArrays(gl.TRIANGLES,0,6);
      gl.uniform1f(uniforms.particles,1);gl.drawArrays(gl.POINTS,0,grid*grid);dirty=false;
    };
    canvas.dataset.renderer="ready";canvas.dataset.geometry="original-head-cutout";frame=requestAnimationFrame(render);
  }catch(error){console.warn("Particle portrait initialization failed",error);canvas.dataset.renderer="unavailable";cleanup();}
  return cleanup;
}


