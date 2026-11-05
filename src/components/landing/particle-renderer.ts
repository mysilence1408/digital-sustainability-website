/** Organic infinity sculpture with stable particle homes and GPU magnetic displacement. */
const quadVertex = `#version 300 es
precision highp float;
out vec2 uv;
void main(){
  vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);
  uv=p; gl_Position=vec4(p*2.-1.,0.,1.);
}`;

// Shared by simulation and draw shaders so moving homes never diverge.
const projection = `
uniform vec2 viewport;
uniform vec2 gaze;
uniform float time,sculpture;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1,0,0,0,c,s,0,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0,-s,0,1,0,s,0,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0,-s,c,0,0,0,1);}
vec3 home(vec4 anchor){
  vec3 p=anchor.xyz;
  if(sculpture>.5){
    p=ry(.2+sin(time*.13)*.07)*rx(.22)*rz(.08+sin(time*.11)*.035)*p*(1.+.014*sin(time*.5));
  }else if(anchor.w<.5){
    p=ry(time*.085)*rx(.12)*p*(1.+.012*sin(time*.65));
  }else{
    // Ring, leaf lamina and veins share this independent orbital transform.
    p=rz(-.38)*rx(.94+.035*sin(time*.18))*rz(time*.105)*p;
  }
  return sculpture>.5?p:p+vec3(0.,.025*sin(time*.48),0.);
}
// Extra horizontal framing accounts for the leaf extending beyond the orbit.
vec3 eye(){return vec3(gaze.x*.2,gaze.y*.16,(sculpture>.5?max(4.8,5.8/(viewport.x/viewport.y)):max(6.,7.4/(viewport.x/viewport.y))));}
mat3 cameraBasis(){
  vec3 z=normalize(eye()),x=normalize(cross(vec3(0,1,0),z));
  return mat3(x,cross(z,x),z);
}
vec3 view(vec3 p){return transpose(cameraBasis())*(p-eye());}
vec4 project(vec3 p){
  vec3 v=view(p);float f=3.171595;
  vec4 clip=vec4(v.x*f/(viewport.x/viewport.y),v.y*f,-v.z*.9998-.2,-v.z);
  return clip;
}
`;

const particleStep = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 result;
uniform sampler2D state,origin;
uniform float hz,pointerActive;
uniform vec2 pointer;
${projection}
void main(){
  vec3 anchor=home(texture(origin,uv));
  // State contains displacement, never the rotated world position.
  vec3 offset=texture(state,uv).xyz;
  if(any(isnan(offset))||any(isinf(offset))||length(offset)>1.)offset=vec3(0.);
  vec4 clip=project(anchor);
  vec2 delta=(clip.xy/clip.w*.5+.5-pointer)*viewport;
  float distanceToPointer=length(delta);
  float radius=clamp(min(viewport.x,viewport.y)*.15,45.,130.);
  float influence=(1.-smoothstep(0.,radius,distanceToPointer))*pointerActive;
  vec2 direction=distanceToPointer>.001?delta/distanceToPointer:vec2(1.,0.);
  vec2 push=direction*radius*.58*influence;
  vec3 destination=cameraBasis()*vec3(push,0.)*(2.*clip.w/(3.171595*viewport.y));
  // Bounded force + exponential relaxation; home keeps rotating independently.
  offset=mix(offset,destination,1.-exp(-.095*hz));
  result=vec4(offset,1.);
}`;

const pointsVertex = `#version 300 es
precision highp float;
uniform sampler2D state,origin;
uniform float size,dpr,density,drawProgress,lightTheme;
out vec4 color;
${projection}
float hash(float n){return fract(sin(n)*43758.5453);}
vec3 pathCenter(float phase){
  float u=phase*6.28318530718+1.57079632679;
  return vec3(1.36*cos(u)*(1.+.035*sin(u)),.58*sin(2.*u)*(1.+.1*cos(u))+.06*cos(u),.25*sin(u));
}
void main(){
  float id=float(gl_VertexID);vec3 random=vec3(hash(id+1.),hash(id+7.),hash(id+19.));
  vec2 uv=(vec2(mod(id,size),floor(id/size))+.5)/size;
  vec4 anchor=texture(origin,uv);
  vec3 homePosition=home(anchor);
  vec3 p=homePosition+texture(state,uv).xyz;
  if(sculpture>.5){
    // A traveling stroke gathers each tube cross-section outward from its centerline.
    // Undrawn segments do not exist on screen; no whole-object fade or clipping mask.
    float stroke=drawProgress*1.04;
    float gathered=smoothstep(anchor.w,anchor.w+.035,stroke);
    vec3 center=home(vec4(pathCenter(anchor.w),anchor.w));
    p=mix(center,homePosition,gathered)+texture(state,uv).xyz*gathered;
  }
  if(sculpture>.5)p*=mix(1.,1.5,pow(random.y,150.));
  gl_Position=project(p);
  float pixels=min(viewport.x,viewport.y)/600.;
  float sprite=mix(1.15,2.6,random.z)*pixels*dpr;
  if(sculpture>.5){
    float distanceToCamera=length(view(p));
    float scale=smoothstep(3.,15.,distanceToCamera)*mix(.5,1.,random.z);
    sprite=.08*dpr*scale*1000./distanceToCamera;
  }
  gl_PointSize=clamp(sprite,1.,5.*dpr);
  vec3 violet=mix(vec3(.38,.16,.8),vec3(.78,.65,1.),random.x);
  vec3 emerald=mix(vec3(.06,.5,.34),vec3(.42,.91,.67),random.x);
  float leaf=step(1.5,anchor.w);
  float accent=leaf+(1.-leaf)*step(.985,random.y);
  vec3 base=mix(violet,emerald,accent);
  // Rim lighting and softer back-facing particles reveal the spherical volume.
  float facing=dot(normalize(homePosition),normalize(eye()-p));
  float rim=pow(1.-abs(facing),2.);
  float light=anchor.w<.5?(.28+.44*rim+.28*max(facing,0.)):1.;
  float shimmer=.88+.12*sin(time*.9+random.y*25.);
  float sparkle=1.+pow(random.z,30.)*.45*(.5+.5*sin(time*1.4+random.x*30.));
  float strength=anchor.w<.5?.42:(anchor.w<1.5?.20:.26);
  if(anchor.w>2.5)strength=.06;
  if(sculpture>.5){
    // Fine silver particles with restrained sage highlights, retaining the original texture.
    base=mix(vec3(random.x*.2),vec3(.43,.64,.49),pow(random.z,65.));
    sparkle=max(.12,.5+(.4+sin(time*4.+random.y*20.))*pow(random.z,10.)*2.5);
    float tip=exp(-pow((anchor.w-drawProgress)/.018,2.))*(1.-step(.99,drawProgress));
    color=vec4(base*sparkle*density*(1.+tip*.65),1.);
    if(lightTheme>.5){
      vec3 ink=mix(vec3(.12,.24,.18),vec3(.34,.43,.28),random.x);
      color=vec4(ink,clamp((.12+random.x*.2)*sparkle*density*(1.+tip*.35),0.,.7));
    }
    if(drawProgress<=0.||anchor.w>drawProgress*1.04){gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=1.;}
  }else{
    color=vec4(base*light*shimmer*sparkle*strength*density,1.);
  }
}`;
const pointsFragment = `#version 300 es
precision highp float;
in vec4 color;out vec4 result;
uniform float lightTheme;
void main(){
  vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);
  if(r>1.)discard;
  // Analytic soft spherical matcap, avoiding an external image request.
  float matcap=sqrt(max(0.,1.-r));
  float shade=(.35+.65*matcap)*(1.-smoothstep(.3,1.,r));
  if(lightTheme>.5){
    float alpha=shade*color.a;
    result=vec4(color.rgb*alpha,alpha);
  }else result=vec4(color.rgb*shade,shade*.65*color.a);
}`;

type Target = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  size: number;
};

/** Starts one scene; the public lifecycle below also handles context restoration. */
function createScene(
  canvas: HTMLCanvasElement,
  sculpture = false,
  isFormationReady: () => boolean = () => true,
  lightTheme = false,
): () => void {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    powerPreference: "default",
  });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia(
    "(max-width: 760px), (pointer: coarse)",
  ).matches;
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
    canvas.dataset.renderer = "unavailable";
    return () => {};
  }

  const programs: WebGLProgram[] = [];
  const targets: Target[] = [];
  let frame = 0;
  let disposed = false;
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  function program(vertex: string, fragment: string) {
    const p = gl!.createProgram()!;
    for (const [type, source] of [
      [gl!.VERTEX_SHADER, vertex],
      [gl!.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        const message = gl!.getShaderInfoLog(shader);
        gl!.deleteShader(shader);
        gl!.deleteProgram(p);
        throw new Error(message ?? "Shader compilation failed");
      }
      gl!.attachShader(p, shader);
      gl!.deleteShader(shader);
    }
    gl!.linkProgram(p);
    if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
      gl!.deleteProgram(p);
      throw new Error("Shader linking failed");
    }
    programs.push(p);
    return p;
  }
  function target(size: number, data: Float32Array | null = null): Target {
    const texture = gl!.createTexture()!,
      framebuffer = gl!.createFramebuffer()!;
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(
      gl!.TEXTURE_2D,
      0,
      gl!.RGBA32F,
      size,
      size,
      0,
      gl!.RGBA,
      gl!.FLOAT,
      data,
    );
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, framebuffer);
    gl!.framebufferTexture2D(
      gl!.FRAMEBUFFER,
      gl!.COLOR_ATTACHMENT0,
      gl!.TEXTURE_2D,
      texture,
      0,
    );
    const result = { texture, framebuffer, size };
    targets.push(result);
    if (
      gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) !== gl!.FRAMEBUFFER_COMPLETE
    )
      throw new Error("Floating-point framebuffer unavailable");
    return result;
  }
  // Cache uniform locations: no shader reflection or allocations in the render loop.
  const locations = new Map<
    WebGLProgram,
    Map<string, WebGLUniformLocation | null>
  >();
  function location(p: WebGLProgram, name: string) {
    if (!locations.has(p)) locations.set(p, new Map());
    const cache = locations.get(p)!;
    if (!cache.has(name)) cache.set(name, gl!.getUniformLocation(p, name));
    return cache.get(name)!;
  }
  function scalar(p: WebGLProgram, name: string, value: number) {
    gl!.uniform1f(location(p, name), value);
  }
  function vector(p: WebGLProgram, name: string, x: number, y: number) {
    gl!.uniform2f(location(p, name), x, y);
  }
  function texture(p: WebGLProgram, name: string, value: Target, unit: number) {
    gl!.activeTexture(gl!.TEXTURE0 + unit);
    gl!.bindTexture(gl!.TEXTURE_2D, value.texture);
    gl!.uniform1i(location(p, name), unit);
  }
  function drawTo(p: WebGLProgram, output: Target) {
    gl!.useProgram(p);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, output.framebuffer);
    gl!.viewport(0, 0, output.size, output.size);
  }
  function release() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    for (const p of programs) gl!.deleteProgram(p);
    for (const t of targets) {
      gl!.deleteTexture(t.texture);
      gl!.deleteFramebuffer(t.framebuffer);
    }
    gl!.deleteVertexArray(vao);
  }

  try {
    const step = program(quadVertex, particleStep),
      points = program(pointsVertex, pointsFragment);
    // Original desktop density, with a smaller GPU texture on mobile. Two passes per frame.
    const size = mobile ? 128 : sculpture ? 512 : 256;
    const count = size * size;
    const anchors = new Float32Array(count * 4);
    const sphereCount = Math.floor(count * 0.76);
    const ringCount = Math.floor(count * 0.16);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let index = 0; index < count; index++) {
      const i = index * 4;
      if (sculpture) {
        // A 3D Gerono infinity curve, with separate front/back strands at the crossing.
        const phase = Math.random();
        const u = phase * Math.PI * 2 + Math.PI / 2;
        const v = Math.random() * Math.PI * 2;
        const sin = Math.sin(u),
          cos = Math.cos(u);
        const sin2 = Math.sin(2 * u),
          cos2 = Math.cos(2 * u);
        const x = 1.36 * cos * (1 + 0.035 * sin);
        const y = 0.58 * sin2 * (1 + 0.1 * cos) + 0.06 * cos;
        const z = 0.25 * sin;
        // Analytic tangent and a perpendicular frame keep the tubular surface continuous.
        let tx = -1.36 * sin + 0.0476 * cos2;
        let ty =
          1.16 * cos2 * (1 + 0.1 * cos) - 0.058 * sin2 * sin - 0.06 * sin;
        let tz = 0.25 * cos;
        const length = Math.hypot(tx, ty, tz);
        tx /= length;
        ty /= length;
        tz /= length;
        const planar = Math.hypot(tx, ty);
        const nx = -ty / planar,
          ny = tx / planar;
        const bx = -tz * ny,
          by = tz * nx,
          bz = tx * ny - ty * nx;
        // A gently folded oval cross-section suggests a leaf at the central meeting.
        const twist = 0.4 * sin2;
        const width = 0.155 + 0.035 * sin * sin;
        const normalOffset =
          width * Math.cos(v) * Math.cos(twist) -
          0.12 * Math.sin(v) * Math.sin(twist);
        const binormalOffset =
          width * Math.cos(v) * Math.sin(twist) +
          0.12 * Math.sin(v) * Math.cos(twist);
        anchors[i] = x + nx * normalOffset + bx * binormalOffset;
        anchors[i + 1] = y + ny * normalOffset + by * binormalOffset;
        anchors[i + 2] = z + bz * binormalOffset;
        anchors[i + 3] = phase;
      } else if (index < sphereCount) {
        // Fibonacci distribution produces a uniform spherical shell, not poles.
        const y = 1 - (2 * (index + 0.5)) / sphereCount;
        const angle = index * goldenAngle;
        const radius = 0.86 * (0.975 + Math.random() * 0.025);
        const circle = Math.sqrt(1 - y * y);
        anchors[i] = radius * circle * Math.cos(angle);
        anchors[i + 1] = radius * y;
        anchors[i + 2] = radius * circle * Math.sin(angle);
        anchors[i + 3] = 0;
      } else if (index < sphereCount + ringCount) {
        const angle = ((index - sphereCount) / ringCount) * Math.PI * 2;
        const tube = Math.random() * Math.PI * 2;
        const thickness = 0.008 + Math.random() * 0.008;
        anchors[i] = (1.38 + thickness * Math.cos(tube)) * Math.cos(angle);
        anchors[i + 1] = (1.13 + thickness * Math.cos(tube)) * Math.sin(angle);
        anchors[i + 2] = thickness * Math.sin(tube);
        anchors[i + 3] = 1;
      } else {
        // A tapered lens with curved midrib and shallow folded 3D lamina.
        const leafIndex = index - sphereCount - ringCount;
        const leafCount = count - sphereCount - ringCount;
        const t = (leafIndex + 0.5) / leafCount;
        const vein = leafIndex % 5 === 0;
        let across = Math.random() * 2 - 1;
        if (vein) {
          across =
            leafIndex % 10 === 0
              ? (Math.random() - 0.5) * 0.025
              : Math.sign(across) * ((t * 7) % 1) * 0.8;
        }
        const width = 0.185 * Math.pow(Math.sin(Math.PI * t), 0.85);
        const along = t * 0.62;
        const side = across * width + 0.065 * Math.sin(Math.PI * t);
        const angle = 0.42;
        const baseX = 1.38 * Math.cos(angle),
          baseY = 1.13 * Math.sin(angle);
        anchors[i] = baseX + along * 0.76 - side * 0.65;
        anchors[i + 1] = baseY + along * 0.65 + side * 0.76;
        anchors[i + 2] =
          0.09 * Math.sin(Math.PI * t) * (1 - across * across) + across * 0.045;
        anchors[i + 3] = vein ? 3 : 2;
      }
    }
    const origin = target(size, anchors);
    const zero = new Float32Array(count * 4);
    let positions = target(size, zero),
      nextPositions = target(size, zero);
    let width = 1,
      height = 1,
      dpr = 1;
    let mouseX = 0.5,
      mouseY = 0.5,
      pointerActive = false;
    let gazeX = 0,
      gazeY = 0,
      lastTime = 0,
      elapsed = 0;
    let drawingElapsed = 0;
    let visible = true;
    let hasRendered = false;
    const bounds = canvas.parentElement!;
    let invalidate = () => {};
    const resize = () => {
      width = Math.max(1, bounds.clientWidth);
      height = Math.max(1, bounds.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      const pixelWidth = Math.round(width * dpr),
        pixelHeight = Math.round(height * dpr);
      if (canvas.width === pixelWidth && canvas.height === pixelHeight) return;
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      invalidate();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(bounds);
    resize();
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerActive =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!pointerActive) return;
      mouseX = (event.clientX - rect.left) / rect.width;
      mouseY = 1 - (event.clientY - rect.top) / rect.height;
    };
    const leave = () => {
      pointerActive = false;
    };
    const pointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") leave();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerup", pointerUp, { passive: true });
    window.addEventListener("pointercancel", leave);
    window.addEventListener("blur", leave);
    document.documentElement.addEventListener("pointerleave", leave);
    const render = (now: number) => {
      if (disposed || document.hidden || !visible) {
        lastTime = 0;
        return;
      }
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
      // Exponential displacement relaxation stays stable without slowing on lower FPS.
      const hz = delta * 60;
      lastTime = now;
      if (!reduced.matches) elapsed += delta;
      const motionTime = reduced.matches ? 0 : elapsed;
      if (reduced.matches) drawingElapsed = 3.4;
      else if (isFormationReady())
        drawingElapsed = Math.min(3.4, drawingElapsed + delta);
      const strokeTime = drawingElapsed / 3.4;
      const drawProgress = reduced.matches
        ? 1
        : strokeTime * strokeTime * (3 - 2 * strokeTime);
      gl.bindVertexArray(vao);
      gl.disable(gl.BLEND);
      gazeX +=
        ((reduced.matches || !pointerActive ? 0 : (mouseX * 2 - 1) * 0.3) -
          gazeX) *
        0.05;
      gazeY +=
        ((reduced.matches || !pointerActive ? 0 : (mouseY * 2 - 1) * 0.25) -
          gazeY) *
        0.05;
      drawTo(step, nextPositions);
      texture(step, "state", positions, 0);
      texture(step, "origin", origin, 1);
      vector(step, "pointer", mouseX, mouseY);
      scalar(step, "pointerActive", pointerActive && !reduced.matches ? 1 : 0);
      scalar(step, "hz", hz);
      scalar(step, "time", motionTime);
      scalar(step, "sculpture", sculpture ? 1 : 0);
      vector(step, "viewport", width, height);
      vector(step, "gaze", gazeX, gazeY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const previousPositions = positions;
      positions = nextPositions;
      nextPositions = previousPositions;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.ONE,
        lightTheme ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA,
      );
      gl.useProgram(points);
      texture(points, "state", positions, 0);
      texture(points, "origin", origin, 1);
      scalar(points, "lightTheme", lightTheme ? 1 : 0);
      scalar(points, "drawProgress", drawProgress);
      scalar(points, "size", size);
      scalar(points, "dpr", dpr);
      scalar(points, "time", motionTime);
      scalar(points, "sculpture", sculpture ? 1 : 0);
      scalar(points, "density", mobile ? 2.2 : 1);
      vector(points, "viewport", width, height);
      vector(points, "gaze", gazeX, gazeY);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.ONE,
        lightTheme ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA,
      );
      gl.drawArrays(gl.POINTS, 0, size * size);
      hasRendered = true;
      if (!reduced.matches) frame = requestAnimationFrame(render);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      lastTime = 0;
      frame = requestAnimationFrame(render);
    };
    invalidate = restart;
    const visibility = () => {
      leave();
      if (document.hidden) {
        cancelAnimationFrame(frame);
        lastTime = 0;
      } else if (!reduced.matches || !hasRendered) restart();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        leave();
        cancelAnimationFrame(frame);
        lastTime = 0;
      } else if (!reduced.matches || !hasRendered) restart();
    });
    intersection.observe(bounds);
    document.addEventListener("visibilitychange", visibility);
    const motionChanged = () => {
      // Reset displacement when disabling motion, then render a single static frame.
      for (const state of [positions, nextPositions]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, state.framebuffer);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gazeX = 0;
      gazeY = 0;
      restart();
    };
    reduced.addEventListener("change", motionChanged);
    canvas.dataset.renderer = "ready";
    frame = requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
      document.documentElement.removeEventListener("pointerleave", leave);
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", motionChanged);
      release();
    };
  } catch (error) {
    release();
    canvas.dataset.renderer = "unavailable";
    console.warn("Particle sculpture WebGL initialization failed:", error);
    return () => {};
  }
}

/** Owns context events separately, so a restored context gets fresh GPU resources. */
function createRenderer(
  canvas: HTMLCanvasElement,
  sculpture: boolean,
  isFormationReady: () => boolean = () => true,
  lightTheme = false,
): () => void {
  let destroy = createScene(canvas, sculpture, isFormationReady, lightTheme);
  const lost = (event: Event) => {
    event.preventDefault();
    destroy();
    canvas.dataset.renderer = "lost";
  };
  const restored = () => {
    destroy = createScene(canvas, sculpture, isFormationReady, lightTheme);
  };
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  return () => {
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("webglcontextrestored", restored);
    destroy();
  };
}

export function createParticleSculptureRenderer(
  canvas: HTMLCanvasElement,
  isFormationReady: () => boolean = () => true,
  lightTheme = false,
): () => void {
  return createRenderer(canvas, true, isFormationReady, lightTheme);
}
