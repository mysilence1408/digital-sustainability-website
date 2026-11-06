/** Photo-guided, authored head sculpts. These are approximate likenesses, not scans.
 * Order matches Team.tsx: 400px clean-shaven portrait, then the bearded portrait.
 * Only anatomy and surface tones live here; presentation stays in the renderer.
 */
const profiles = [
  { height: 1.025, width: .675, jawTaper: .23, jawRoundness: .91,
    eyeSpacing: .244, eyeY: .205, eyeWidth: .145, eyeDepth: .105,
    browY: .315, browHeight: .064, noseTip: .245, noseWidth: .088,
    noseY: -.055, bridgeWidth: .065, mouthWidth: .218, mouthY: -.365,
    upperLip: .023, lowerLip: .033, chinWidth: .225, chinProjection: .055,
    cheek: .036, hairline: .665, hairVolume: .045, beard: false },
  { height: .995, width: .735, jawTaper: .105, jawRoundness: .78,
    eyeSpacing: .258, eyeY: .19, eyeWidth: .153, eyeDepth: .082,
    browY: .29, browHeight: .052, noseTip: .215, noseWidth: .112,
    noseY: -.07, bridgeWidth: .082, mouthWidth: .257, mouthY: -.37,
    upperLip: .035, lowerLip: .040, chinWidth: .28, chinProjection: .069,
    cheek: .064, hairline: .62, hairVolume: .078, beard: true },
] as const;
export function createHeadGeometry(count: number) {
  const positions = [new Float32Array(count * 3), new Float32Array(count * 3)];
  const normals = [new Float32Array(count * 3), new Float32Array(count * 3)];
  const tones = [new Float32Array(count), new Float32Array(count)];
  const gauss = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) => Math.exp(-2 * (((x-cx)/sx)**2 + ((y-cy)/sy)**2));
  const head = (u: number, v: number, member: number): [number,number,number] => {
    const profile = profiles[member];
    const latitude = v * Math.PI;
    const longitude = u * Math.PI * 2;
    const y = Math.cos(latitude) * profile.height;
    const ring = Math.pow(Math.max(0,Math.sin(latitude)), profile.jawRoundness);
    const jaw = 1 - profile.jawTaper * Math.max(0,-y) + .055 * Math.exp(-(((y+.2)/.22)**2));
    const x = ring * Math.sin(longitude) * profile.width * jaw;
    let z = ring * Math.cos(longitude) * .66;
    const front = Math.max(0, Math.cos(longitude)) ** 5;
    // Bridge, tip, nostrils, eye sockets, brow ridge, cheekbones, lips and chin.
    let detail = .16*gauss(x,y,0,.14,profile.bridgeWidth,.32) + profile.noseTip*gauss(x,y,0,profile.noseY,profile.noseWidth,.13);
    detail += .045*(gauss(x,y,-.09,-.08,.052,.055)+gauss(x,y,.09,-.08,.052,.055));
    for(const side of [-1,1]) {
      detail -= profile.eyeDepth*gauss(x,y,side*profile.eyeSpacing,profile.eyeY,profile.eyeWidth,.083);
      // Raised lid rims around recessed eyes, rather than hollow mannequin sockets.
      detail += .023*gauss(x,y,side*profile.eyeSpacing,profile.eyeY-.045,profile.eyeWidth,.025);
      detail += .027*gauss(x,y,side*profile.eyeSpacing,profile.eyeY+.045,profile.eyeWidth,.025);
      detail += profile.browHeight*gauss(x,y,side*profile.eyeSpacing,profile.browY,.17,.055);
      detail += profile.cheek*gauss(x,y,side*.33,-.10,.18,.19);
      if(profile.beard)detail -= .012*gauss(x,y,side*.28,-.32,.04,.10);
    }
    const lipY=profile.mouthY+.025*Math.pow(x/profile.mouthWidth,2);
    detail += profile.upperLip*gauss(x,y,0,lipY+.032,profile.mouthWidth,.032)+profile.lowerLip*gauss(x,y,0,lipY-.035,profile.mouthWidth,.043);
    detail -= .024*gauss(x,y,0,lipY,profile.mouthWidth,.015);
    detail += profile.chinProjection*gauss(x,y,0,-.66,profile.chinWidth,.18);
    z += detail*front;
    const hairline = profile.hairline - .10*Math.pow(Math.min(1,Math.abs(x)/profile.width),2) + .025*Math.sin(x*7.);
    const curls = profile.beard ? .008*Math.sin(u*131.)*Math.sin(v*149.) : .005*Math.sin(u*57.+v*23.);
    const hair = Math.max(0,Math.min(1,(y-hairline)*15));
    z += hair*(profile.hairVolume*.55+curls)*Math.cos(longitude);
    const swept = profile.beard ? 0 : .025*Math.exp(-(((x+.18)/.3)**2));
    return [x*(1+hair*.055),y+hair*(profile.hairVolume+curls+swept),z];
  };
  for(let member=0;member<2;member++) for(let i=0;i<count;i++) {
    // The same sample topology in both models makes every particle morph continuously.
    const u = (i*.618033988749895)%1;
    const v = Math.acos(1-2*(i+.5)/count)/Math.PI;
    let p = head(u,v,member), normal: number[];
    if(i%23===0) {
      const side=i%46===0?-1:1;
      const a=u*Math.PI*2,b=v*Math.PI;
      p=[side*((member?.68:.64)+.075*Math.sin(b)*Math.cos(a)),-.035+.18*Math.cos(b),.015+.085*Math.sin(b)*Math.sin(a)];
      normal=[side*Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];
    } else {
      const a=head(u+.0001,v,member),b=head(u,Math.min(.99999,v+.0001),member);
      const du=a.map((value,j)=>value-p[j]),dv=b.map((value,j)=>value-p[j]);
      normal=[du[1]*dv[2]-du[2]*dv[1],du[2]*dv[0]-du[0]*dv[2],du[0]*dv[1]-du[1]*dv[0]];
      if(normal[0]*p[0]+normal[1]*p[1]+normal[2]*p[2]<0)normal=normal.map(value=>-value);
    }
    const length=Math.hypot(...normal)||1;
    positions[member].set(p,i*3);normals[member].set(normal.map(value=>value/length),i*3);
    const [x,y,z]=p;
    const profile=profiles[member];
    let tone=.78;
    const hairline=profile.hairline-.10*Math.pow(Math.min(1,Math.abs(x)/profile.width),2)+.025*Math.sin(x*7.);
    if(y>hairline)tone=profile.beard?.13+.045*Math.sin(i*3.7):.16;
    if(z>.35) {
      const brow=gauss(x,y,-profile.eyeSpacing,profile.browY,.18,.043)+gauss(x,y,profile.eyeSpacing,profile.browY,.18,.043);
      tone*=1-.7*Math.min(1,brow);
      const eyes=gauss(x,y,-profile.eyeSpacing,profile.eyeY,.115,.035)+gauss(x,y,profile.eyeSpacing,profile.eyeY,.115,.035);
      tone*=1-.65*Math.min(1,eyes);
      if(profile.beard) {
        const jawBeard=Math.min(1,Math.max(0,(-y-.27)*8));
        const moustache=Math.min(1,gauss(x,y,-.095,-.28,.13,.05)+gauss(x,y,.095,-.28,.13,.05));
        tone*=1-.69*Math.max(jawBeard*(.80+.20*Math.sin(i*11.)),moustache);
      }
      tone*=1-.30*gauss(x,y,0,profile.mouthY,profile.mouthWidth,.023);
    }
    tones[member][i]=tone;
  }
  return {positions,normals,tones};
}
