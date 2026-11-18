'use strict';
(() => {
 const G=VC,T=THREE;G.solids=[];G.roads=[-216,-144,-72,0,72,144,216];G.cityLimit=252;
 let seed=7841;G.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 G.box(1100,.8,1100,'#087c99',0,-1.2,0);G.box(535,1,535,'#d6b67a',0,-.55,0);
 G.box(505,.12,505,'#40826e',0,-.01,0);
 for(const r of G.roads){G.box(19,.15,519,'#34424a',r,.05,0);G.box(519,.15,19,'#34424a',0,.06,r);for(const side of [-1,1]){G.box(2,.24,518,'#e7d2ad',r+side*10.5,.13,0);G.box(518,.24,2,'#e7d2ad',0,.14,r+side*10.5)}for(let v=-248;v<250;v+=12){if(!G.roads.some(a=>Math.abs(a-v)<12)){G.box(.18,.02,5,'#f4c76a',r,.15,v);G.box(5,.02,.18,'#f4c76a',v,.16,r)}}}
 const palette=['#e6c995','#d87863','#dba99a','#388b91','#f0dcb4','#e3ad59','#669a91'];
 function building(x,z,w,d,h,color){const g=new T.Group();g.position.set(x,0,z);G.scene.add(g);G.box(w,h,d,color,0,h/2,0,g);G.box(w+1,.5,d+1,'#f6dfb6',0,h+.1,0,g);G.box(w-2,.7,d-2,'#a99b85',0,h+.7,0,g);G.solids.push({x,z,w:w+1,d:d+1});
  for(let y=3;y<h-1;y+=3.6){for(let a=-w/2+2;a<w/2-1;a+=3.8){for(const s of [-1,1])G.box(1.6,1.9,.08,'#244f62',a,y,s*(d/2+.05),g)}for(let a=-d/2+2;a<d/2-1;a+=3.8){for(const s of [-1,1])G.box(.08,1.9,1.6,'#244f62',s*(w/2+.05),y,a,g)}}
  for(const s of [-1,1]){G.box(w+.4,.4,.6,'#fff1cf',0,2.1,s*d/2,g);if(h<20)G.box(w+.8,.25,2.4,'#db694f',0,3.6,s*(d/2+.8),g)}
  if(h>23){G.box(4,2,4,'#71868a',2,h+1.7,1,g);G.cylinder(.1,.1,5,'#314954',-3,h+3,-2,g)}return g;
 }
 for(let i=0;i<6;i++)for(let j=0;j<6;j++){const cx=-180+i*72,cz=-180+j*72;if((i===3&&j===3)||(i===5&&j===2)){G.box(46,.2,46,'#70a572',cx,.18,cz);for(let k=0;k<6;k++)palm(cx-20+k*8,cz-18);continue}for(const dx of [-14,14])for(const dz of [-14,14]){let h=8+G.random()*19;if(i<2&&j>2)h+=18;building(cx+dx,cz+dz,21+G.random()*3,20+G.random()*4,h,palette[Math.floor(G.random()*palette.length)])}}
 function palm(x,z){const g=new T.Group();g.position.set(x,0,z);G.scene.add(g);G.cylinder(.22,.4,7,'#9b7552',0,3.5,0,g);for(let a=0;a<6;a++){const leaf=G.box(5,.13,.85,'#267b56',Math.sin(a)*1.6,7,Math.cos(a)*1.6,g);leaf.rotation.y=-a;leaf.rotation.z=.17*Math.cos(a)}G.cylinder(.65,.7,.7,'#338956',0,7,0,g)}G.palm=palm;
 for(let r=-240;r<250;r+=24){palm(232,r);palm(r,232);if(Math.abs(r)>22)palm(13,r)}
 for(const r of G.roads)for(let z=-230;z<240;z+=48){const pole=G.cylinder(.1,.13,7,'#2c5361',r-12.5,3.5,z);G.box(3,.15,.18,'#2c5361',r-11,7,z);G.box(.8,.15,.6,'#fff0b8',r-9.5,6.9,z)}
 for(const x of G.roads)for(const z of G.roads){for(let a=-7;a<8;a+=2.8){G.box(1.6,.025,3,'#f8e7be',x+a,.17,z+12);G.box(3,.025,1.6,'#f8e7be',x+12,.17,z+a)}}
 const places=[['ORCHID MARKET',-28,17,13,0],['RADIO SAFFRON',43,24,58,Math.PI],['THE SILK ROOM',-40,12,-59,0],['PORT AUTHORITY',-173,32,-130,0],['CIRCUIT MOTORS',115,11,58,Math.PI]];
 for(const [text,x,y,z,a]of places){const sign=G.sign(text,15,3);sign.position.set(x,y,z);sign.rotation.y=a;G.scene.add(sign)}
 // The promenade, breakwater and distant harbor are all modeled geometry.
 G.box(550,.25,12,'#ead7ae',0,.2,265);G.box(550,1,1,'#f3e5c1',0,.8,272);for(let x=-270;x<280;x+=8)G.box(.2,1.6,.2,'#315b67',x,1.2,272);
 for(let x=-220;x<240;x+=65){G.box(18,1,45,'#b8956b',x,0,292);G.box(5,2,12,'#f9e4bc',x,1,310);G.box(4,2,5,'#2c6674',x,2.8,311)}
 for(let i=0;i<12;i++){const x=-240+i*40;G.box(25,8,13,['#cb684d','#237b83','#e7b757'][i%3],x,4,-270);}
 G.blocked=(x,z,r=.6)=>Math.abs(x)>256||Math.abs(z)>265||G.solids.some(b=>Math.abs(x-b.x)<b.w/2+r&&Math.abs(z-b.z)<b.d/2+r);
 G.district=(x,z)=>z>180?'SAFFRON QUAY':x<-100?'GLASS DISTRICT':x>100?'CORAL WARD':z<-90?'NORTH FREIGHT':'ORCHID PROMENADE';
})();
