/** Dependency-free particle renderer. Coordinates and choreography are original. */
export function createParticleField(canvas, options = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return { destroy() {}, replay() {}, setMorph() {} };
  const host = canvas.parentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const quality = options.quality || (window.innerWidth < 700 ? 'low' : 'high');
  const count = quality === 'low' ? 2400 : 5600;
  let seed = 8219;
  const random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
  const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(.0001, random()))) * Math.cos(6.283185 * random());
  const TAU = Math.PI * 2;
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const smooth = n => n*n*(3-2*n);
  let w = 1, h = 1, dpr = 1, raf = 0, destroyed = false, inView = true;
  let time = 0, last = 0, intro = reduced.matches ? 10 : 0, morph = 0, targetMorph = 0;
  let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0, vx = 0, vy = 0;
  let dragging = false, px = 0, py = 0;
  const palette = ['#8bcaff', '#c2e9ff', '#fffaf3', '#ffae76'];
  const stars = Array.from({length: quality === 'low' ? 240 : 600}, () => ({x:random(),y:random(),r:.2+random()*1.05,a:.15+random()*.6,p:random()*TAU,c:Math.floor(random()*4)}));
  // Four thin, slightly irregular nested U ribbons, with dense star clusters.
  function uPoint(s, ribbon) {
    const radius = .49 + ribbon*.062;
    const vertical = 1.03, length = vertical*2 + Math.PI*radius;
    const at = s*length;
    if (at < vertical) return [-radius, -.84+at];
    if (at < vertical + Math.PI*radius) {
      const a = Math.PI-(at-vertical)/radius;
      return [radius*Math.cos(a),.19+radius*Math.sin(a)];
    }
    return [radius,.19-(at-vertical-Math.PI*radius)];
  }
  const particles = Array.from({length:count}, (_,i) => {
    const ribbon = Math.floor(random()*4)-1.5;
    const cluster = Math.floor(random()*50);
    const s = random()<.7 ? (cluster/50 + gaussian()*.006 + 1)%1 : random();
    const [x,y] = uPoint(s,ribbon);
    const noise = random()<.89 ? .009 : .037;
    const phi = s*TAU*2 + ribbon*.72;
    const theta = Math.acos(1-2*((i+.5)/count));
    const bright = random();
    return {s,ribbon,dx:gaussian()*noise,dy:gaussian()*noise,x:x+gaussian()*noise,y:y+gaussian()*noise,z:gaussian()*.026,
      gx:.8*Math.sin(theta)*Math.cos(phi),gy:.8*Math.cos(theta),gz:.8*Math.sin(theta)*Math.sin(phi),
      phase:random()*TAU,velocity:.2+random()*.7,
      angle:random()*TAU,orbit:.35+random()*1.4,
      radius:bright>.982 ? 2.5+random()*1.4 : bright>.91 ? 1.0+random()*1.1 : .28+random()*.62,
      glow:bright>.91,color:Math.floor(random()*4),opacity:.25+random()*.75};
  });
  // Cache glow sprites so the animation does not create thousands of gradients per frame.
  const sprites = palette.map(color => {
    const c = document.createElement('canvas'); c.width=c.height=64;
    const g=c.getContext('2d'); const grad=g.createRadialGradient(32,32,0,32,32,32);
    grad.addColorStop(0,'#ffffff');grad.addColorStop(.045,'#ffffff');grad.addColorStop(.12,color);
    grad.addColorStop(.3,color+'60');grad.addColorStop(1,color+'00');
    g.fillStyle=grad;g.fillRect(0,0,64,64);return c;
  });
  function resize() {
    const box=canvas.getBoundingClientRect(); w=Math.max(1,box.width);h=Math.max(1,box.height);
    dpr=Math.min(window.devicePixelRatio||1,quality==='low'?1.5:2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    if (reduced.matches) draw(0);
  }
  function project(x,y,z, scale) {
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
    const X=x*cy+z*sy, Z=-x*sy+z*cy;
    const Y=y*cx-Z*sx, depth=y*sx+Z*cx;
    const perspective=3.8/(3.8+depth);
    return [w*(options.centerX ?? .5)+X*scale*perspective,h*.5+Y*scale*perspective,perspective,depth];
  }
  function draw(dt) {
    if(!reduced.matches){time+=dt;intro+=dt;}
    const reveal=reduced.matches?1:smooth(clamp((intro-.2)/3.6,0,1));
    morph+=(targetMorph-morph)*Math.min(1,dt*3.5);
    if(!dragging){targetYaw+=vx;targetPitch=clamp(targetPitch+vy,-1.1,1.1);vx*=Math.pow(.04,dt);vy*=Math.pow(.04,dt);}
    yaw+=(targetYaw+(reduced.matches?0:Math.sin(time*.16)*.11)-yaw)*Math.min(1,dt*5+.025);
    pitch+=(targetPitch+(reduced.matches?0:Math.sin(time*.12)*.055)-pitch)*Math.min(1,dt*5+.025);
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle=options.background || '#050a0e';ctx.fillRect(0,0,w,h);
    const vignette=ctx.createRadialGradient(w*.5,h*.48,0,w*.5,h*.48,Math.max(w,h)*.68);
    vignette.addColorStop(0,'#000000');vignette.addColorStop(.55,'#050a0e');vignette.addColorStop(1,'#0a151d');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
    for(const p of stars){ctx.globalAlpha=p.a*(.75+.25*Math.sin(time*.35+p.p));ctx.fillStyle=palette[p.c];ctx.beginPath();ctx.arc((p.x*w+yaw*12+w)%w,(p.y*h+pitch*8+h)%h,p.r,0,TAU);ctx.fill();}
    const scale=Math.min(h*.49,w*(w<650?.57:.285))*(1-morph*.15);
    const introSpin=(1-reveal)*1.8;
    ctx.globalCompositeOperation='lighter';
    for(const p of particles){
      const drift=reduced.matches?0:Math.sin(time*p.velocity+p.phase)*.004;
      const flow = reduced.matches ? p.s : (p.s + time*.003)%1;
      const [ux,uy] = uPoint(flow,p.ribbon);
      let x=(ux+p.dx)*(1-morph)+p.gx*morph, y=(uy+p.dy)*(1-morph)+p.gy*morph, z=p.z*(1-morph)+p.gz*morph;
      // The initial nebula spirals into the letter, then gently breathes in place.
      const a=p.angle+introSpin;
      x=x*reveal+Math.cos(a)*p.orbit*(1-reveal);y=y*reveal+Math.sin(a)*p.orbit*(1-reveal);
      z+=Math.sin(time*.23+p.phase)*.008+drift;
      const [X,Y,perspective,depth]=project(x+drift,y+drift,z,scale);
      const twinkle=reduced.matches?1:.63+.37*Math.pow(.5+.5*Math.sin(time*1.1+p.phase),2);
      const alpha=p.opacity*twinkle*(.18+.82*smooth(clamp(intro/1.3,0,1)))*clamp(1-depth*.3,.25,1);
      ctx.globalAlpha=alpha;
      const radius=p.radius*perspective;
      if(p.glow){const size=radius*10;ctx.drawImage(sprites[p.color],X-size/2,Y-size/2,size,size);ctx.fillStyle=palette[p.color];ctx.beginPath();ctx.arc(X,Y,radius*.46,0,TAU);ctx.fill();}
      else {ctx.fillStyle=palette[p.color];ctx.fillRect(X,Y,Math.max(.4,radius),Math.max(.4,radius));}
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  }
  function frame(timestamp){raf=0;if(destroyed||!inView||document.hidden)return;const dt=last?Math.max(0,(timestamp-last)/1000):.016;last=timestamp;draw(dt);if(!reduced.matches)raf=requestAnimationFrame(frame);}
  function start(){if(!destroyed&&!raf&&inView&&!document.hidden){last=0;raf=requestAnimationFrame(frame);}}
  function down(e){if(!options.interactive)return;dragging=true;px=e.clientX;py=e.clientY;vx=vy=0;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';}
  function move(e){if(!dragging)return;const dx=(e.clientX-px)*.004,dy=(e.clientY-py)*.004;targetYaw+=dx;targetPitch=clamp(targetPitch+dy,-1.1,1.1);vx=dx*.12;vy=dy*.12;px=e.clientX;py=e.clientY;if(reduced.matches){yaw=targetYaw;pitch=targetPitch;draw(0);}}
  function up(){dragging=false;canvas.style.cursor=options.interactive?'grab':'default';}
  function key(e){if(!options.interactive||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();targetYaw+=(e.key==='ArrowLeft'?-.16:e.key==='ArrowRight'?.16:0);targetPitch=clamp(targetPitch+(e.key==='ArrowUp'?-.12:e.key==='ArrowDown'?.12:0),-1.1,1.1);if(reduced.matches){yaw=targetYaw;pitch=targetPitch;draw(0);}}
  function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();}
  function preference(){if(reduced.matches){cancelAnimationFrame(raf);raf=0;intro=10;draw(0);}else start();}
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)start();else{cancelAnimationFrame(raf);raf=0;}},{threshold:0});io.observe(host);
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('lostpointercapture',up);canvas.addEventListener('keydown',key);
  document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',preference);
  resize();start();
  return {
    replay(){intro=reduced.matches?10:0;targetYaw=targetPitch=yaw=pitch=vx=vy=0;time=0;start();if(reduced.matches)draw(0);},
    setMorph(value){targetMorph=clamp(value,0,1);if(reduced.matches){morph=targetMorph;draw(0);}},
    destroy(){destroyed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('lostpointercapture',up);canvas.removeEventListener('keydown',key);}
  };
}
