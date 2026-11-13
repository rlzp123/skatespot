import { useEffect, useRef, useState } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

type SpotCategory = 'Street' | 'Bowl' | 'Plaza' | 'DIY';
type SpotLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
type BoardModelKey = 'street' | 'oldschool' | 'cyber';
type TrickType =
  | 'none'
  | 'ollie'
  | 'kickflip'
  | 'heelflip'
  | 'shuvit360'
  | 'treflip'
  | 'hardflip'
  | 'impossible'
  | 'laserflip';

type ThemeKey = 'volt' | 'coral' | 'sunset';

interface ThemePalette {
  name: string;
  navBg: string;
  pageBg: string;
  posterBg: string;
  accent: string;
  accentShadow: string;
  accentText: string;
  mapSea: string;
  mapBlock: string;
  mapRoad: string;
}

const THEMES: Record<ThemeKey, ThemePalette> = {
  volt: {
    name: 'Roxo & Neon Volt',
    navBg: 'rgba(26, 11, 46, 0.94)',
    pageBg: 'linear-gradient(170deg, #1A0B2E 0%, #3B1869 52%, #9F85E8 100%)',
    posterBg:
      'radial-gradient(circle at 80% 78%, #F3E8FF 0%, #B794F4 34%, #4C1D95 68%, #1A0B2E 100%)',
    accent: '#A3E635',
    accentShadow: '#365314',
    accentText: '#111827',
    mapSea: '#1E1035',
    mapBlock: '#341C5C',
    mapRoad: '#6D42B5',
  },
  coral: {
    name: 'Turquesa & Coral',
    navBg: 'rgba(13, 59, 62, 0.94)',
    pageBg: 'linear-gradient(170deg, #0D3B3E 0%, #14747A 52%, #99E2DF 100%)',
    posterBg:
      'radial-gradient(circle at 80% 78%, #F0FDFA 0%, #99E2DF 34%, #14747A 68%, #0D3B3E 100%)',
    accent: '#FF3B5C',
    accentShadow: '#881337',
    accentText: '#FFFFFF',
    mapSea: '#0E4246',
    mapBlock: '#186368',
    mapRoad: '#38A3A5',
  },
  sunset: {
    name: 'Azul & Laranja',
    navBg: 'rgba(13, 56, 99, 0.94)',
    pageBg: 'linear-gradient(170deg, #145391 0%, #3681C4 55%, #B8DAF4 100%)',
    posterBg:
      'radial-gradient(circle at 80% 78%, #F8FBFF 0%, #BADBF4 34%, #3A82C4 68%, #134C87 100%)',
    accent: '#FF7A1A',
    accentShadow: '#9E3B00',
    accentText: '#FFFFFF',
    mapSea: '#0D3B66',
    mapBlock: '#144E85',
    mapRoad: '#2B74B8',
  },
};

const TRICK_LIST: { id: TrickType; label: string }[] = [
  { id: 'ollie', label: 'Ollie' },
  { id: 'kickflip', label: 'Kickflip' },
  { id: 'heelflip', label: 'Heelflip' },
  { id: 'shuvit360', label: '360 Shuvit' },
  { id: 'treflip', label: 'Tre Flip' },
  { id: 'hardflip', label: 'Hardflip' },
  { id: 'impossible', label: 'Impossible' },
  { id: 'laserflip', label: 'Laser Flip' },
];

interface Spot {
  id: number;
  name: string;
  zone: string;
  type: SpotCategory;
  level: SpotLevel;
  rating: number;
  floor: string;
  lighting: boolean;
  crowdStatus: 'Tranquilo' | 'Sessão Moderada' | 'Pico Cheio';
  floorStatus: 'Seco e Rápido' | 'Borda Encerada';
  activeRiders: number;
  obstacles: string[];
  challenges: string[];
  distance: string;
  pinX: number;
  pinY: number;
  reviews: Review[];
}

const INITIAL_SPOTS: Spot[] = [
  {
    id: 1,
    name: 'Plaza da Matriz',
    zone: 'Setor Central',
    type: 'Plaza',
    level: 'Intermediário',
    rating: 4.9,
    floor: 'Granito Polido',
    lighting: true,
    crowdStatus: 'Sessão Moderada',
    floorStatus: 'Borda Encerada',
    activeRiders: 7,
    obstacles: ['Corrimão 6 degraus', 'Borda de mármore', 'Manual Pad', 'Gap'],
    challenges: ['Ollie na escada 6 degraus', '50-50 na borda de mármore', 'Manual até o final do pad'],
    distance: '0.8 km',
    pinX: 46,
    pinY: 42,
    reviews: [
      {
        id: 101,
        author: 'Lucas_Flip',
        rating: 5,
        comment: 'Piso perfeito, não trava a roda. Iluminação vai até 23h.',
      },
      {
        id: 102,
        author: 'Mariana.SB',
        rating: 5,
        comment: 'Bordas bem enceradas e clima muito da hora na sessão.',
      },
    ],
  },
  {
    id: 2,
    name: 'Bowl do Viaduto',
    zone: 'Zona Norte',
    type: 'Bowl',
    level: 'Avançado',
    rating: 4.8,
    floor: 'Concreto Usinado',
    lighting: true,
    crowdStatus: 'Tranquilo',
    floorStatus: 'Seco e Rápido',
    activeRiders: 4,
    obstacles: ['Bowl 2.6m', 'Spine', 'Extension', 'Coping de ferro'],
    challenges: ['Drop na parte funda (2.6m)', 'Axle Stall no coping', 'Transfer pelo Spine'],
    distance: '2.1 km',
    pinX: 72,
    pinY: 28,
    reviews: [
      {
        id: 103,
        author: 'Rafa_Grind',
        rating: 5,
        comment: 'Transição rápida e coping perfeito pra encaixar smith.',
      },
    ],
  },
  {
    id: 3,
    name: 'Pico da Estação',
    zone: 'Distrito Industrial',
    type: 'Street',
    level: 'Iniciante',
    rating: 4.6,
    floor: 'Asfalto Liso',
    lighting: false,
    crowdStatus: 'Tranquilo',
    floorStatus: 'Seco e Rápido',
    activeRiders: 3,
    obstacles: ['Caixote baixo', 'Banco reto', 'Solo plano'],
    challenges: ['Kickflip no solo', 'Boardslide no caixote', 'Shuvit em movimento'],
    distance: '3.4 km',
    pinX: 26,
    pinY: 64,
    reviews: [
      {
        id: 104,
        author: 'Pedro_Ollie',
        rating: 4,
        comment: 'Ótimo pra treinar manobra de solo e borda baixa.',
      },
    ],
  },
  {
    id: 4,
    name: 'DIY Ponte Velha',
    zone: 'Zona Leste',
    type: 'DIY',
    level: 'Intermediário',
    rating: 4.7,
    floor: 'Cimento Queimado',
    lighting: true,
    crowdStatus: 'Pico Cheio',
    floorStatus: 'Borda Encerada',
    activeRiders: 11,
    obstacles: ['Quarter improvisado', 'Wallride', 'Cano reto'],
    challenges: ['Wallride na parede curva', 'Rock to Fakie no Quarter', 'Feeble no cano reto'],
    distance: '4.2 km',
    pinX: 74,
    pinY: 70,
    reviews: [
      {
        id: 105,
        author: 'Gui_Street',
        rating: 5,
        comment: 'Construído pelos próprios skatistas locais. Pico clássico!',
      },
    ],
  },
  {
    id: 5,
    name: 'Skatepark do Lago',
    zone: 'Zona Sul',
    type: 'Plaza',
    level: 'Iniciante',
    rating: 4.9,
    floor: 'Concreto Polido',
    lighting: true,
    crowdStatus: 'Sessão Moderada',
    floorStatus: 'Seco e Rápido',
    activeRiders: 9,
    obstacles: ['Euro Gap', 'Rampa 45°', 'Corrimão baixo', 'Hubba'],
    challenges: ['Subir o Euro Gap de Ollie', '50-50 na Hubba baixa', 'Heelflip na rampa 45°'],
    distance: '5.0 km',
    pinX: 34,
    pinY: 26,
    reviews: [
      {
        id: 106,
        author: 'Caio_SB',
        rating: 5,
        comment: 'Pista nova, perfeita pra passar a tarde inteira andando.',
      },
    ],
  },
];

const TRICK_GUIDE = [
  { name: 'Ollie', level: 'Base', tip: 'Bata o tail com força e arraste o pé da frente até o nose para nivelar no ar.' },
  { name: 'Kickflip', level: 'Intermediário', tip: 'Chute a diagonal externa do nose com a ponta do tênis para girar o shape.' },
  { name: 'Heelflip', level: 'Intermediário', tip: 'Empurre o calcanhar para fora na borda frontal do shape enquanto salta.' },
  { name: 'Tre Flip (360 Flip)', level: 'Avançado', tip: 'Combine um chute forte de 360 shuvit no pé de trás com um toque leve de kickflip.' },
  { name: 'Impossible', level: 'Avançado', tip: 'Enrole o tail verticalmente ao redor do pé de trás em um giro de 360°.' },
  { name: 'Laser Flip', level: 'Pro', tip: 'Empurre o shuvit frontside 360° enquanto chuta o heelflip com o pé da frente.' },
];

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function project3D(
  p: Vec3,
  rx: number,
  ry: number,
  rz: number,
  cx: number,
  cy: number,
  fov: number,
  yOffset = 0
): { x: number; y: number } {
  const y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
  const z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);

  const x2 = p.x * Math.cos(ry) + z1 * Math.sin(ry);
  const z2 = -p.x * Math.sin(ry) + z1 * Math.cos(ry);

  const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
  const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz) + yOffset;

  const scale = fov / (fov + z2 + 270);
  return {
    x: cx + x3 * scale,
    y: cy + y3 * scale,
  };
}

function getDeckGeometry(model: BoardModelKey): Vec3[] {
  if (model === 'oldschool') {
    // Shape Old School Cruiser (Fish Tail recortado + bico largo)
    return [
      { x: -136, y: -14, z: -26 }, // Ponta esquerda do Fish Tail
      { x: -115, y: -11, z: 0 },   // Recorte interno "V" do Fish Tail
      { x: -136, y: -14, z: 26 },  // Ponta direita do Fish Tail
      { x: -95, y: -4, z: 36 },
      { x: -20, y: 2, z: 42 },
      { x: 55, y: 2, z: 45 },      // Parte frontal bem larga
      { x: 108, y: -8, z: 33 },
      { x: 136, y: -14, z: 0 },    // Nose arredondado
      { x: 108, y: -8, z: -33 },
      { x: 55, y: 2, z: -45 },
      { x: -20, y: 2, z: -42 },
      { x: -95, y: -4, z: -36 },
    ];
  }

  if (model === 'cyber') {
    // Shape Tech Carbon com pontas chanfradas geométricas
    return [
      { x: -138, y: -16, z: -12 },
      { x: -138, y: -16, z: 12 },
      { x: -110, y: -8, z: 34 },
      { x: -75, y: 0, z: 36 },
      { x: 75, y: 0, z: 36 },
      { x: 110, y: -8, z: 34 },
      { x: 138, y: -16, z: 12 },
      { x: 138, y: -16, z: -12 },
      { x: 110, y: -8, z: -34 },
      { x: 75, y: 0, z: -36 },
      { x: -75, y: 0, z: -36 },
      { x: -110, y: -8, z: -34 },
    ];
  }

  // Street Pro Twin-Tail Clássico
  return [
    { x: -136, y: -16, z: 0 },
    { x: -120, y: -10, z: -26 },
    { x: -82, y: 0, z: -35 },
    { x: 0, y: 3, z: -36 },
    { x: 82, y: 0, z: -35 },
    { x: 120, y: -10, z: -26 },
    { x: 136, y: -16, z: 0 },
    { x: 120, y: -10, z: 26 },
    { x: 82, y: 0, z: 35 },
    { x: 0, y: 3, z: 36 },
    { x: -82, y: 0, z: 35 },
    { x: -120, y: -10, z: 26 },
  ];
}

/* ============================================================================
   SKATE 3D COM 3 MODELOS DE SHAPE, OCLUSÃO DE LIXA/ARTE E 8 MANOBRAS
   ============================================================================ */
function HeroSkate3D({
  accentColor,
  accentShadow,
}: {
  accentColor: string;
  accentShadow: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [boardModel, setBoardModel] = useState<BoardModelKey>('street');
  const [lastTrickLabel, setLastTrickLabel] = useState<string>('');
  const [comboCount, setComboCount] = useState<number>(0);

  const trickRef = useRef<{ type: TrickType; start: number }>({ type: 'none', start: 0 });
  const rotOffsetRef = useRef({ rx: 0, ry: 0 });
  const dragRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  const stateRef = useRef({ accentColor, accentShadow, boardModel });
  stateRef.current = { accentColor, accentShadow, boardModel };

  const runTrick = (type: TrickType, label: string) => {
    trickRef.current = { type, start: performance.now() };
    setLastTrickLabel(label);
    setComboCount((c) => c + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2 - 4;
      const fov = Math.min(w, h) * 0.92;

      ctx.clearRect(0, 0, w, h);

      const { accentColor: curAccent, accentShadow: curShadow, boardModel: curModel } =
        stateRef.current;
      const deckOutline = getDeckGeometry(curModel);

      const wheelSpread = curModel === 'oldschool' ? 32 : 28;
      const wheelRadiusBase = curModel === 'oldschool' ? 15.5 : 13;
      const wheels: Vec3[] = [
        { x: -76, y: 20, z: -wheelSpread },
        { x: -76, y: 20, z: wheelSpread },
        { x: 76, y: 20, z: -wheelSpread },
        { x: 76, y: 20, z: wheelSpread },
      ];

      const t = now * 0.0022;
      const hoverY = Math.sin(t) * 6;

      let trickRx = 0;
      let trickRy = 0;
      let trickRz = 0;
      let jumpY = 0;

      if (trickRef.current.type !== 'none') {
        const duration = 920;
        const elapsed = now - trickRef.current.start;
        const p = Math.min(elapsed / duration, 1);

        // Curva suave de subida e aterrisagem
        jumpY = -Math.sin(p * Math.PI) * 44;

        switch (trickRef.current.type) {
          case 'ollie':
            jumpY = -Math.sin(p * Math.PI) * 58;
            trickRz = -Math.sin(p * Math.PI * 2) * 0.48;
            break;
          case 'kickflip':
            trickRx = p * Math.PI * 2;
            trickRz = -Math.sin(p * Math.PI) * 0.22;
            break;
          case 'heelflip':
            trickRx = -p * Math.PI * 2;
            trickRz = -Math.sin(p * Math.PI) * 0.22;
            break;
          case 'shuvit360':
            trickRy = p * Math.PI * 2;
            break;
          case 'treflip':
            trickRx = p * Math.PI * 2;
            trickRy = p * Math.PI * 2;
            break;
          case 'hardflip':
            trickRx = p * Math.PI * 2;
            trickRy = -p * Math.PI;
            trickRz = Math.sin(p * Math.PI) * 0.65;
            break;
          case 'impossible':
            trickRz = -p * Math.PI * 2;
            trickRx = Math.sin(p * Math.PI) * 0.35;
            break;
          case 'laserflip':
            trickRx = -p * Math.PI * 2;
            trickRy = -p * Math.PI * 2;
            break;
        }

        if (p >= 1) {
          trickRef.current.type = 'none';
          setLastTrickLabel('');
        }
      }

      const rx =
        -0.78 + Math.sin(t * 0.7) * 0.05 + rotOffsetRef.current.rx + trickRx;
      const ry =
        0.54 + Math.cos(t * 0.6) * 0.07 + rotOffsetRef.current.ry + trickRy;
      const rz = -0.4 + trickRz;
      const yOff = hoverY + jumpY;

      // Calcula a normal do topo do shape (0, -1, 0) para saber qual lado está virado para a câmera
      const nz1 = -Math.sin(rx);
      const nz2 = nz1 * Math.cos(ry);
      const isBottomFacing = nz2 >= 0;

      // Sombra projetada
      const shadowScale = Math.max(0.55, 1 + jumpY / 130);
      ctx.fillStyle = 'rgba(10, 6, 24, 0.28)';
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy + 84,
        92 * shadowScale,
        17 * shadowScale,
        -0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Funções auxiliares de desenho para oclusão 3D real
      const drawTrucksAndWheels = () => {
        const drawTruck = (tx: number) => {
          const base = project3D({ x: tx, y: 3, z: 0 }, rx, ry, rz, cx, cy, fov, yOff);
          const axL = project3D(
            { x: tx, y: 19, z: -wheelSpread },
            rx,
            ry,
            rz,
            cx,
            cy,
            fov,
            yOff
          );
          const axR = project3D(
            { x: tx, y: 19, z: wheelSpread },
            rx,
            ry,
            rz,
            cx,
            cy,
            fov,
            yOff
          );
          const midX = (axL.x + axR.x) / 2;
          const midY = (axL.y + axR.y) / 2;

          ctx.fillStyle = curModel === 'cyber' ? '#FBBF24' : '#52525B';
          ctx.beginPath();
          ctx.arc(base.x, base.y, 7.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = curModel === 'cyber' ? '#FDE68A' : '#F4F4F5';
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(axL.x, axL.y);
          ctx.lineTo(axR.x, axR.y);
          ctx.stroke();

          ctx.strokeStyle = '#71717A';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(midX, midY);
          ctx.stroke();
        };

        drawTruck(-76);
        drawTruck(76);

        wheels.forEach((wp) => {
          const proj = project3D(wp, rx, ry, rz, cx, cy, fov, yOff);
          const r = wp.z > 0 ? wheelRadiusBase + 1.5 : wheelRadiusBase - 0.5;

          ctx.fillStyle = curModel === 'oldschool' ? '#FFFFFF' : curAccent;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = curShadow;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = curModel === 'oldschool' ? curAccent : '#18181B';
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, r * 0.44, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, r * 0.16, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      const drawDeck = () => {
        const gripPts = deckOutline.map((p) =>
          project3D({ x: p.x, y: p.y - 4, z: p.z }, rx, ry, rz, cx, cy, fov, yOff)
        );
        const bottomPts = deckOutline.map((p) =>
          project3D(p, rx, ry, rz, cx, cy, fov, yOff)
        );

        // Camada de madeira (Ply)
        ctx.fillStyle = curModel === 'cyber' ? curAccent : '#D4A373';
        ctx.beginPath();
        (isBottomFacing ? gripPts : bottomPts).forEach((pt, i) =>
          i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
        );
        ctx.closePath();
        ctx.fill();

        if (isBottomFacing) {
          // LADO DE BAIXO: Arte Gráfica personalizada por modelo
          const grad = ctx.createLinearGradient(
            bottomPts[0].x,
            bottomPts[0].y,
            bottomPts[6].x,
            bottomPts[6].y
          );
          if (curModel === 'oldschool') {
            grad.addColorStop(0, '#1E1B4B');
            grad.addColorStop(0.5, '#312E81');
            grad.addColorStop(1, '#0F172A');
          } else if (curModel === 'cyber') {
            grad.addColorStop(0, '#09090B');
            grad.addColorStop(0.5, '#18181B');
            grad.addColorStop(1, '#09090B');
          } else {
            grad.addColorStop(0, '#141418');
            grad.addColorStop(0.5, '#27272A');
            grad.addColorStop(1, '#0F0F13');
          }

          ctx.fillStyle = grad;
          ctx.strokeStyle = curAccent;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          bottomPts.forEach((pt, i) =>
            i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Listras gráficas diagonais no shape
          const s1 = project3D({ x: -35, y: 2, z: -32 }, rx, ry, rz, cx, cy, fov, yOff);
          const s2 = project3D({ x: -10, y: 2, z: 32 }, rx, ry, rz, cx, cy, fov, yOff);
          const s3 = project3D({ x: 35, y: 2, z: -32 }, rx, ry, rz, cx, cy, fov, yOff);
          const s4 = project3D({ x: 60, y: 2, z: 32 }, rx, ry, rz, cx, cy, fov, yOff);

          ctx.strokeStyle = curAccent;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.moveTo(s3.x, s3.y);
          ctx.lineTo(s4.x, s4.y);
          ctx.stroke();

          // Emblema central
          const center = project3D({ x: 0, y: 3, z: 0 }, rx, ry, rz, cx, cy, fov, yOff);
          ctx.save();
          ctx.translate(center.x, center.y);
          ctx.rotate(rz);
          ctx.fillStyle = curAccent;
          ctx.beginPath();
          ctx.ellipse(0, 0, 38, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#111827';
          ctx.font = '900 10.5px Impact, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            curModel === 'oldschool'
              ? 'CRUISER 86'
              : curModel === 'cyber'
              ? 'CARBON X'
              : 'SKATESPOT',
            0,
            4
          );
          ctx.restore();
        } else {
          // LADO DE CIMA: Lixa Preta + Recorte na cor do tema + 8 Parafusos
          ctx.fillStyle = '#111115';
          ctx.strokeStyle = '#D4A373';
          ctx.lineWidth = 2;
          ctx.beginPath();
          gripPts.forEach((pt, i) =>
            i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
          );
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Faixa recortada na lixa (grip gap)
          const g1 = project3D({ x: 48, y: -4, z: -29 }, rx, ry, rz, cx, cy, fov, yOff);
          const g2 = project3D({ x: 56, y: -4, z: 29 }, rx, ry, rz, cx, cy, fov, yOff);
          ctx.strokeStyle = curAccent;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(g1.x, g1.y);
          ctx.lineTo(g2.x, g2.y);
          ctx.stroke();

          // 8 parafusos de base (4 na frente, 4 atrás)
          const bolts: Vec3[] = [
            { x: -84, y: -4, z: -10 },
            { x: -84, y: -4, z: 10 },
            { x: -68, y: -4, z: -10 },
            { x: -68, y: -4, z: 10 },
            { x: 68, y: -4, z: -10 },
            { x: 68, y: -4, z: 10 },
            { x: 84, y: -4, z: -10 },
            { x: 84, y: -4, z: 10 },
          ];
          bolts.forEach((b) => {
            const bp = project3D(b, rx, ry, rz, cx, cy, fov, yOff);
            ctx.fillStyle = curAccent;
            ctx.beginPath();
            ctx.arc(bp.x, bp.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      };

      // Ordem de renderização 3D correta
      if (isBottomFacing) {
        drawDeck();
        drawTrucksAndWheels();
      } else {
        drawTrucksAndWheels();
        drawDeck();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const triggerRandomCombo = () => {
    const pick = TRICK_LIST[Math.floor(Math.random() * TRICK_LIST.length)];
    runTrick(pick.id, pick.label.toUpperCase());
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Seletor de Modelo de Shape + Contador de Combo */}
      <div style={styles.modelSelectorBar}>
        {(
          [
            { key: 'street', label: 'Street Pro' },
            { key: 'oldschool', label: 'Old School' },
            { key: 'cyber', label: 'Tech Carbon' },
          ] as { key: BoardModelKey; label: string }[]
        ).map((m) => (
          <button
            key={m.key}
            onClick={() => setBoardModel(m.key)}
            style={{
              ...styles.modelPillBtn,
              ...(boardModel === m.key
                ? {
                    backgroundColor: accentColor,
                    color: '#111827',
                    borderColor: '#FFFFFF',
                  }
                : {}),
            }}
          >
            {m.label}
          </button>
        ))}

        {comboCount > 0 && (
          <span style={styles.comboCounterPill}>🔥 {comboCount}x</span>
        )}
      </div>

      {lastTrickLabel && (
        <div
          style={{
            ...styles.trickToast,
            backgroundColor: accentColor,
            color: '#111827',
          }}
        >
          {lastTrickLabel}!
        </div>
      )}

      {/* Área 3D interativa (arraste para girar 360° ou toque para manobra) */}
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!dragRef.current.dragging) return;
          const dx = e.clientX - dragRef.current.lastX;
          const dy = e.clientY - dragRef.current.lastY;
          rotOffsetRef.current.ry += dx * 0.015;
          rotOffsetRef.current.rx += dy * 0.015;
          dragRef.current.lastX = e.clientX;
          dragRef.current.lastY = e.clientY;
        }}
        onPointerUp={() => {
          dragRef.current.dragging = false;
        }}
        onPointerLeave={() => {
          dragRef.current.dragging = false;
        }}
        onClick={() => {
          if (!dragRef.current.dragging) {
            triggerRandomCombo();
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          display: 'block',
          touchAction: 'none',
        }}
      />

      {/* Grade com as 8 Manobras 3D */}
      <div style={styles.tricksGridBar}>
        {TRICK_LIST.map((tr) => (
          <button
            key={tr.id}
            style={styles.trickMiniBtn}
            onClick={() => runTrick(tr.id, tr.label.toUpperCase())}
          >
            {tr.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   BLUEPRINT 3D DO OBSTÁCULO NO MODAL
   ============================================================================ */
function Obstacle3DPreview({
  category,
  accentColor,
}: {
  category: SpotCategory;
  accentColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let angle = 0.4;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      angle += 0.016;
      const cx = rect.width / 2;
      const cy = rect.height / 2 + 8;

      const lines: [Vec3, Vec3][] = [];

      if (category === 'Bowl') {
        const steps = 10;
        for (let i = 0; i < steps; i++) {
          const t1 = (i / steps) * Math.PI;
          const t2 = ((i + 1) / steps) * Math.PI;
          const x1 = -Math.cos(t1) * 72;
          const y1 = Math.sin(t1) * 30 - 14;
          const x2 = -Math.cos(t2) * 72;
          const y2 = Math.sin(t2) * 30 - 14;
          lines.push([{ x: x1, y: y1, z: -34 }, { x: x2, y: y2, z: -34 }]);
          lines.push([{ x: x1, y: y1, z: 34 }, { x: x2, y: y2, z: 34 }]);
          if (i % 2 === 0) lines.push([{ x: x1, y: y1, z: -34 }, { x: x1, y: y1, z: 34 }]);
        }
      } else if (category === 'Plaza' || category === 'Street') {
        for (let s = 0; s < 4; s++) {
          const x0 = -58 + s * 29;
          const y0 = -20 + s * 10;
          lines.push([{ x: x0, y: y0, z: -30 }, { x: x0 + 29, y: y0, z: -30 }]);
          lines.push([{ x: x0, y: y0, z: 30 }, { x: x0 + 29, y: y0, z: 30 }]);
          lines.push([{ x: x0, y: y0, z: -30 }, { x: x0, y: y0, z: 30 }]);
        }
        lines.push([{ x: -62, y: -34, z: 0 }, { x: 62, y: 10, z: 0 }]);
      } else {
        const box: Vec3[] = [
          { x: -60, y: 14, z: -28 },
          { x: 60, y: 14, z: -28 },
          { x: 60, y: -12, z: -28 },
          { x: -28, y: -12, z: -28 },
          { x: -60, y: 14, z: 28 },
          { x: 60, y: 14, z: 28 },
          { x: 60, y: -12, z: 28 },
          { x: -28, y: -12, z: 28 },
        ];
        const edges: [number, number][] = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];
        edges.forEach(([a, b]) => lines.push([box[a], box[b]]));
      }

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.2;
      lines.forEach(([a, b]) => {
        const pa = project3D(a, 0.45, angle, 0, cx, cy, 260);
        const pb = project3D(b, 0.45, angle, 0, cx, cy, 260);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });

      ctx.restore();
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [category, accentColor]);

  return (
    <div style={styles.blueprintBox}>
      <span style={styles.blueprintLabel}>MODELO 3D DO OBSTÁCULO • {category.toUpperCase()}</span>
      <canvas ref={canvasRef} style={{ width: '100%', height: '105px', display: 'block' }} />
    </div>
  );
}

/* ============================================================================
   APLICATIVO PRINCIPAL SKATESPOT
   ============================================================================ */
export default function App() {
  const [themeKey] = useState<ThemeKey>('volt');
  const theme = THEMES[themeKey];

  const [spots, setSpots] = useState<Spot[]>(INITIAL_SPOTS);
  const [activeTab, setActiveTab] = useState<'poster' | 'spots' | 'map' | 'profile'>('poster');
  const [selectedMapSpotId, setSelectedMapSpotId] = useState<number>(1);
  const [detailSpotId, setDetailSpotId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [filterType, setFilterType] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<number[]>([1, 2]);
  const [checkedInIds, setCheckedInIds] = useState<number[]>([1]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([
    'Ollie na escada 6 degraus',
    'Kickflip no solo',
  ]);

  const [deckSize, setDeckSize] = useState('8.125"');
  const [wheelSize, setWheelSize] = useState('53mm 99A');
  const [truckBrand, setTruckBrand] = useState('139mm Hollow');

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const [spotName, setSpotName] = useState('');
  const [spotZone, setSpotZone] = useState('');
  const [spotType, setSpotType] = useState<SpotCategory>('Street');
  const [spotLevel, setSpotLevel] = useState<SpotLevel>('Intermediário');
  const [spotObstacles, setSpotObstacles] = useState('');

  const types = ['Todos', 'Street', 'Plaza', 'Bowl', 'DIY'];

  const totalXp =
    checkedInIds.length * 100 +
    completedChallenges.length * 50 +
    savedIds.length * 25;

  const skaterRank =
    totalXp >= 400 ? 'Pro Local' : totalXp >= 200 ? 'Amador Urbano' : 'Rookie';

  const filteredSpots = spots.filter((spot) => {
    const matchType = filterType === 'Todos' || spot.type === filterType;
    const matchSearch =
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const activeMapSpot =
    filteredSpots.find((s) => s.id === selectedMapSpotId) ||
    filteredSpots[0] ||
    null;

  const detailSpot = spots.find((s) => s.id === detailSpotId) || null;

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCheckIn = (id: number) => {
    setCheckedInIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleChallenge = (challengeName: string) => {
    setCompletedChallenges((prev) =>
      prev.includes(challengeName)
        ? prev.filter((c) => c !== challengeName)
        : [...prev, challengeName]
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailSpot || !newComment.trim()) return;

    const reviewItem: Review = {
      id: Date.now(),
      author: 'Você (Aluno #31)',
      rating: newRating,
      comment: newComment.trim(),
    };

    setSpots((prev) =>
      prev.map((s) => {
        if (s.id !== detailSpot.id) return s;
        const updatedReviews = [reviewItem, ...s.reviews];
        const avg =
          updatedReviews.reduce((acc, r) => acc + r.rating, 0) /
          updatedReviews.length;
        return {
          ...s,
          rating: Number(avg.toFixed(1)),
          reviews: updatedReviews,
        };
      })
    );

    setNewComment('');
    setNewRating(5);
  };

  const handleCreateSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim() || !spotZone.trim()) return;

    const newId = Date.now();
    const autoX = 24 + ((spots.length * 19) % 54);
    const autoY = 24 + ((spots.length * 23) % 50);

    const created: Spot = {
      id: newId,
      name: spotName.trim(),
      zone: spotZone.trim(),
      type: spotType,
      level: spotLevel,
      rating: 5.0,
      floor: 'Concreto Liso',
      lighting: true,
      crowdStatus: 'Tranquilo',
      floorStatus: 'Seco e Rápido',
      activeRiders: 1,
      obstacles: spotObstacles
        ? spotObstacles.split(',').map((o) => o.trim())
        : ['Borda', 'Solo reto'],
      challenges: ['Acertar primeira linha no pico', 'Ollie no obstáculo principal'],
      distance: '0.5 km',
      pinX: autoX,
      pinY: autoY,
      reviews: [
        {
          id: newId + 1,
          author: 'Você (Aluno #31)',
          rating: 5,
          comment: 'Novo pico cadastrado no SkateSpot!',
        },
      ],
    };

    setSpots([created, ...spots]);
    setSelectedMapSpotId(newId);
    setSpotName('');
    setSpotZone('');
    setSpotObstacles('');
    setShowAddModal(false);
    setActiveTab('spots');
  };

  const giantTitleShadow = `
    1px 1px 0 ${theme.accentShadow},
    2px 2px 0 ${theme.accentShadow},
    3px 3px 0 ${theme.accentShadow},
    4px 4px 0 ${theme.accentShadow},
    5px 5px 0 #0F172A,
    6px 6px 0 #0F172A,
    8px 12px 20px rgba(10, 6, 28, 0.55)
  `;

  return (
    <div className="app-container" style={{ background: theme.pageBg }}>
      {/* BARRA SUPERIOR UNIFICADA */}
      <header className="top-navbar" style={{ backgroundColor: theme.navBg }}>
        <div className="top-navbar-inner">
          <div style={styles.brandGroup} onClick={() => setActiveTab('poster')}>
            <div
              style={{
                ...styles.brandStar,
                backgroundColor: theme.accent,
                color: theme.accentText,
                boxShadow: `2px 2px 0 ${theme.accentShadow}`,
              }}
            >
              ★
            </div>
            <div>
              <h1 style={styles.brandTitle}>
                SKATE<span style={{ color: theme.accent }}>SPOT</span>
              </h1>
              <span style={styles.brandSub}>
                {skaterRank} • {totalXp} XP
              </span>
            </div>
          </div>

<nav className="desktop-nav-links">
            {(
              [
                { id: 'poster', label: 'Capa Pôster' },
                { id: 'spots', label: `Pistas (${spots.length})` },
                { id: 'map', label: 'Mapa Urbano' },
                { id: 'profile', label: 'Setup & Manobras' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className="nav-tab-btn"
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.accent,
                          borderColor: '#FFFFFF',
                          color: theme.accentText,
                          fontWeight: 900,
                          boxShadow: `0 2px 10px rgba(0, 0, 0, 0.28)`,
                        }
                      : undefined
                  }
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ====================================================================
          TELA 1: CAPA PÔSTER 3D COM NOVO MODELO DE SKATE E 8 MANOBRAS
          ==================================================================== */}
      {activeTab === 'poster' && (
        <section className="poster-wrapper" style={{ background: theme.posterBg }}>
          <svg viewBox="0 0 360 240" style={styles.cloudTop} className="cloud-a">
            <defs>
              <radialGradient id="c1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#F3E8FF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="65" r="75" fill="url(#c1)" />
            <circle cx="305" cy="105" r="85" fill="url(#c1)" />
          </svg>

          <svg viewBox="0 0 360 240" style={styles.cloudBottom} className="cloud-b">
            <defs>
              <radialGradient id="c2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#EDE9FE" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="240" cy="155" r="105" fill="url(#c2)" />
            <circle cx="165" cy="185" r="85" fill="url(#c2)" />
          </svg>

          <div className="poster-inner">
            <p style={styles.posterTopCopy}>
              SKATEBOARDING IS A POPULAR EXTREME SPORT AND MODE OF URBAN EXPLORATION.
              ARRASTE O SKATE PARA GIRAR 360° OU ESCOLHA UMA MANOBRA ABAIXO.
            </p>

            <div className="poster-center-stage">
              <div className="poster-3d-title-box">
                <div
                  className="poster-3d-text"
                  style={{ color: theme.accent, textShadow: giantTitleShadow }}
                >
                  SKATE
                </div>
                <div
                  className="poster-3d-text"
                  style={{ color: theme.accent, textShadow: giantTitleShadow }}
                >
                  SPOT
                </div>
              </div>

              <div className="poster-canvas-box">
                <HeroSkate3D
                  accentColor={theme.accent}
                  accentShadow={theme.accentShadow}
                />
              </div>
            </div>

            <div className="poster-bottom-row">
              <div style={styles.posterLeftBlock}>
                <p style={styles.posterSideCopy}>
                  {spots.length} PISTAS MAPEADAS • STATUS AO VIVO • DESAFIOS DE
                  MANOBRAS NA CIDADE.
                </p>
                <svg width="32" height="32" viewBox="0 0 24 24" style={{ marginTop: '4px' }}>
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>

              <blockquote style={styles.posterQuote}>
                &ldquo;Don&apos;t be afraid to fall,
                <br />
                because that&apos;s where you
                <br />
                learn to fly.&rdquo;
              </blockquote>
            </div>

            <div style={styles.posterButtonsRow}>
              <button
                style={{
                  ...styles.ctaPrimary,
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                }}
                onClick={() => setActiveTab('spots')}
              >
                EXPLORAR {spots.length} PISTAS →
              </button>
              <button
                style={styles.ctaSecondary}
                onClick={() => setActiveTab('map')}
              >
                MAPA AO VIVO
              </button>
            </div>
          </div>

          <svg
            viewBox="0 0 400 90"
            preserveAspectRatio="none"
            style={styles.bottomShards}
          >
            <polygon points="0,90 32,48 68,66 52,90" fill={theme.accent} />
            <polygon
              points="255,90 278,40 258,34 326,26 338,72 318,64 304,90"
              fill={theme.accent}
            />
          </svg>
        </section>
      )}

      {/* ====================================================================
          TELA 2: PISTAS (COM STATUS AO VIVO E DESAFIOS)
          ==================================================================== */}
      {activeTab === 'spots' && (
        <main className="page-content">
          <div style={styles.controlsCard}>
            <input
              type="text"
              placeholder="Buscar pista por nome, bairro ou obstáculo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <div style={styles.chipsRow}>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  style={{
                    ...styles.filterChip,
                    ...(filterType === t
                      ? {
                          backgroundColor: theme.accent,
                          color: theme.accentText,
                          borderColor: theme.accent,
                        }
                      : {}),
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="spots-grid">
            {filteredSpots.map((spot) => {
              const isSaved = savedIds.includes(spot.id);
              const doneCount = spot.challenges.filter((c) =>
                completedChallenges.includes(c)
              ).length;

              return (
                <article key={spot.id} style={styles.spotCard}>
                  <div
                    style={{ ...styles.cardHeaderBanner, background: theme.navBg }}
                    onClick={() => setDetailSpotId(spot.id)}
                  >
                    <div style={styles.cardBannerTop}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span
                          style={{
                            ...styles.orangeBadge,
                            backgroundColor: theme.accent,
                            color: theme.accentText,
                          }}
                        >
                          {spot.type}
                        </span>
                        <span style={styles.liveRidersPill}>
                          ● {spot.activeRiders} na sessão
                        </span>
                      </div>
                      <span style={styles.ratingBadge}>★ {spot.rating}</span>
                    </div>
                    <h2 style={styles.cardTitle}>{spot.name}</h2>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.cardMetaRow}>
                      <div>
                        <p style={styles.cardSub}>
                          📍 {spot.zone} • {spot.distance} • {spot.level}
                        </p>
                        <p style={styles.cardFloor}>
                          Piso: <strong>{spot.floorStatus}</strong> •{' '}
                          {spot.crowdStatus}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleSave(spot.id)}
                        style={{
                          ...styles.favBtn,
                          color: isSaved ? theme.accent : '#94A3B8',
                        }}
                      >
                        {isSaved ? '★' : '☆'}
                      </button>
                    </div>

                    <div style={styles.obstaclesWrap}>
                      {spot.obstacles.map((obs, idx) => (
                        <span key={idx} style={styles.obstacleTag}>
                          {obs}
                        </span>
                      ))}
                    </div>

                    <div style={styles.challengeProgressBar}>
                      <span>
                        🎯 Desafios concluídos:{' '}
                        <strong>
                          {doneCount}/{spot.challenges.length}
                        </strong>
                      </span>
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>
                        +{doneCount * 50} XP
                      </span>
                    </div>

                    <button
                      style={styles.cardOpenBtn}
                      onClick={() => setDetailSpotId(spot.id)}
                    >
                      Abrir Pista, Desafios 3D e Avaliações
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      )}

      {/* ====================================================================
          TELA 3: MAPA URBANO AO VIVO
          ==================================================================== */}
      {activeTab === 'map' && (
        <main className="page-content">
          <div style={styles.chipsRow}>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  ...styles.filterChip,
                  ...(filterType === t
                    ? {
                        backgroundColor: theme.accent,
                        color: theme.accentText,
                        borderColor: theme.accent,
                      }
                    : {}),
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="map-layout">
            <div style={styles.mapBoard}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.mapSvg}>
                <rect width="100" height="100" fill={theme.mapSea} />
                <rect x="8" y="10" width="24" height="20" rx="2" fill={theme.mapBlock} />
                <rect x="42" y="8" width="20" height="22" rx="2" fill={theme.mapBlock} />
                <rect x="68" y="12" width="24" height="20" rx="2" fill={theme.mapBlock} />
                <rect x="10" y="42" width="24" height="26" rx="2" fill={theme.mapBlock} />
                <rect x="42" y="40" width="20" height="26" rx="2" fill={theme.mapBlock} />
                <rect x="68" y="42" width="24" height="26" rx="2" fill={theme.mapBlock} />
                <line x1="0" y1="35" x2="100" y2="35" stroke={theme.mapRoad} strokeWidth="2" />
                <line x1="0" y1="74" x2="100" y2="74" stroke={theme.mapRoad} strokeWidth="1.6" />
                <line x1="37" y1="0" x2="37" y2="100" stroke={theme.mapRoad} strokeWidth="2" />
                <line x1="65" y1="0" x2="65" y2="100" stroke={theme.mapRoad} strokeWidth="1.6" />
                <path
                  d="M 5 18 Q 50 52 95 60"
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="1.5"
                  strokeDasharray="2.5 2"
                />
              </svg>

              <div
                style={{
                  ...styles.userMarker,
                  borderColor: theme.accent,
                  left: '50%',
                  top: '52%',
                }}
              >
                <div className="radar-pulse" />
              </div>

              {filteredSpots.map((spot) => {
                const isSelected = activeMapSpot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedMapSpotId(spot.id)}
                    style={{
                      ...styles.pinBtn,
                      left: `${spot.pinX}%`,
                      top: `${spot.pinY}%`,
                      transform: isSelected
                        ? 'translate(-50%, -100%) scale(1.15)'
                        : 'translate(-50%, -100%) scale(1)',
                      zIndex: isSelected ? 20 : 10,
                    }}
                  >
                    <div
                      style={{
                        ...styles.pinTag,
                        backgroundColor: isSelected ? theme.accent : '#111827',
                        color: isSelected ? theme.accentText : '#FFFFFF',
                      }}
                    >
                      {spot.type} ★{spot.rating}
                    </div>
                    <div
                      style={{
                        ...styles.pinTip,
                        borderTopColor: isSelected ? theme.accent : '#111827',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {activeMapSpot && (
              <div style={styles.selectedMapPanel}>
                <div style={styles.cardBannerTop}>
                  <span
                    style={{
                      ...styles.orangeBadge,
                      backgroundColor: theme.accent,
                      color: theme.accentText,
                    }}
                  >
                    {activeMapSpot.type}
                  </span>
                  <span style={styles.ratingBadge}>
                    ● {activeMapSpot.activeRiders} skatistas • ★ {activeMapSpot.rating}
                  </span>
                </div>

                <h2 style={styles.panelTitle}>{activeMapSpot.name}</h2>
                <p style={styles.cardSub}>
                  📍 {activeMapSpot.zone} • {activeMapSpot.distance}
                </p>
                <p style={styles.cardFloor}>
                  Condição: {activeMapSpot.floorStatus} • {activeMapSpot.crowdStatus}
                </p>

                <div style={styles.obstaclesWrap}>
                  {activeMapSpot.obstacles.map((o, idx) => (
                    <span key={idx} style={styles.obstacleTag}>
                      {o}
                    </span>
                  ))}
                </div>

                <div style={styles.panelButtons}>
                  <button
                    style={{
                      ...styles.ctaPrimary,
                      backgroundColor: theme.accent,
                      color: theme.accentText,
                    }}
                    onClick={() => setDetailSpotId(activeMapSpot.id)}
                  >
                    Desafios & Ver 3D
                  </button>
                  <button
                    style={{
                      ...styles.checkInBtn,
                      backgroundColor: checkedInIds.includes(activeMapSpot.id)
                        ? '#16A34A'
                        : '#111827',
                    }}
                    onClick={() => toggleCheckIn(activeMapSpot.id)}
                  >
                    {checkedInIds.includes(activeMapSpot.id) ? '✓ Colei (+100 XP)' : 'Check-in'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ====================================================================
          TELA 4: PERFIL, MEU SETUP E GUIA DE MANOBRAS
          ==================================================================== */}
      {activeTab === 'profile' && (
        <main className="page-content">
          <div className="two-col-desktop">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={styles.whiteCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      ...styles.avatarBox,
                      backgroundColor: theme.accent,
                      color: theme.accentText,
                    }}
                  >
                    #31
                  </div>
                  <div>
                    <h2 style={styles.panelTitle}>Skater #31</h2>
                    <p style={styles.cardSub}>
                      Nível: <strong>{skaterRank}</strong> • {totalXp} XP acumulados
                    </p>
                  </div>
                </div>

                <div style={styles.statsRow}>
                  <div style={styles.statMiniBox}>
                    <strong>{checkedInIds.length}</strong>
                    <span>Check-ins</span>
                  </div>
                  <div style={styles.statMiniBox}>
                    <strong>{completedChallenges.length}</strong>
                    <span>Desafios</span>
                  </div>
                  <div style={styles.statMiniBox}>
                    <strong>{savedIds.length}</strong>
                    <span>Favoritas</span>
                  </div>
                </div>
              </div>

              <div style={styles.whiteCard}>
                <h3 style={styles.subHeading}>🛹 Meu Setup Atual</h3>
                <div style={styles.setupGrid}>
                  <div>
                    <label style={styles.setupLabel}>Shape</label>
                    <select
                      style={styles.formField}
                      value={deckSize}
                      onChange={(e) => setDeckSize(e.target.value)}
                    >
                      <option value='7.75"'>7.75&quot; (Street Técnico)</option>
                      <option value='8.0"'>8.0&quot; (Versátil)</option>
                      <option value='8.125"'>8.125&quot; (Plaza / Gap)</option>
                      <option value='8.5"'>8.5&quot; (Bowl / Transição)</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.setupLabel}>Rodas</label>
                    <select
                      style={styles.formField}
                      value={wheelSize}
                      onChange={(e) => setWheelSize(e.target.value)}
                    >
                      <option value="52mm 101A">52mm 101A</option>
                      <option value="53mm 99A">53mm 99A</option>
                      <option value="56mm 97A">56mm 97A</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.setupLabel}>Trucks</label>
                    <select
                      style={styles.formField}
                      value={truckBrand}
                      onChange={(e) => setTruckBrand(e.target.value)}
                    >
                      <option value="139mm Hollow">139mm Hollow</option>
                      <option value="144mm Standard">144mm Standard</option>
                      <option value="149mm Pro">149mm Pro</option>
                    </select>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>
                  Setup ativo: <strong>Shape {deckSize}</strong> •{' '}
                  <strong>Truck {truckBrand}</strong> • <strong>Roda {wheelSize}</strong>
                </p>
              </div>
            </div>

            <div style={styles.whiteCard}>
              <h3 style={styles.subHeading}>📖 Guia de Manobras para Sessão</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {TRICK_GUIDE.map((trick) => (
                  <div key={trick.name} style={styles.trickGuideItem}>
                    <div style={styles.reviewTop}>
                      <strong style={{ fontSize: '14px' }}>{trick.name}</strong>
                      <span
                        style={{
                          ...styles.orangeBadge,
                          backgroundColor: theme.accent,
                          color: theme.accentText,
                        }}
                      >
                        {trick.level}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                      {trick.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* BARRA INFERIOR MOBILE */}
      <nav className="bottom-mobile-nav" style={{ backgroundColor: theme.navBg }}>
        <button
          style={{
            ...styles.mobNavBtn,
            color: activeTab === 'poster' ? theme.accent : '#E2E8F0',
          }}
          onClick={() => setActiveTab('poster')}
        >
          <span style={{ fontSize: '17px' }}>★</span>
          <span>Capa</span>
        </button>

        <button
          style={{
            ...styles.mobNavBtn,
            color: activeTab === 'spots' ? theme.accent : '#E2E8F0',
          }}
          onClick={() => setActiveTab('spots')}
        >
          <span style={{ fontSize: '17px' }}>🛹</span>
          <span>Pistas</span>
        </button>

        <button
          style={{
            ...styles.mobNavBtn,
            color: activeTab === 'map' ? theme.accent : '#E2E8F0',
          }}
          onClick={() => setActiveTab('map')}
        >
          <span style={{ fontSize: '17px' }}>📍</span>
          <span>Mapa</span>
        </button>

        <button
          style={{
            ...styles.mobNavBtn,
            color: activeTab === 'profile' ? theme.accent : '#E2E8F0',
          }}
          onClick={() => setActiveTab('profile')}
        >
          <span style={{ fontSize: '17px' }}>🏆</span>
          <span>Setup</span>
        </button>
      </nav>

      {/* ====================================================================
          MODAL DE DETALHES: BLUEPRINT 3D + DESAFIOS + AVALIAÇÕES
          ==================================================================== */}
      {detailSpot && (
        <div className="modal-backdrop" onClick={() => setDetailSpotId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <span
                  style={{
                    ...styles.orangeBadge,
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                  }}
                >
                  {detailSpot.type}
                </span>
                <h2 style={styles.panelTitle}>{detailSpot.name}</h2>
                <p style={styles.cardSub}>
                  {detailSpot.zone} • {detailSpot.floorStatus} •{' '}
                  {detailSpot.activeRiders} skatistas agora
                </p>
              </div>
              <button style={styles.closeBtn} onClick={() => setDetailSpotId(null)}>
                ✕
              </button>
            </div>

            <Obstacle3DPreview category={detailSpot.type} accentColor={theme.accent} />

            <div style={styles.challengesBox}>
              <strong style={{ fontSize: '13px' }}>
                🎯 Desafios deste Pico (Clique ao acertar):
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {detailSpot.challenges.map((ch) => {
                  const done = completedChallenges.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChallenge(ch)}
                      style={{
                        ...styles.challengeItemBtn,
                        backgroundColor: done ? '#DCFCE7' : '#FFFFFF',
                        borderColor: done ? '#22C55E' : '#CBD5E1',
                      }}
                    >
                      <span>{done ? '✅' : '⬜'} {ch}</span>
                      <span style={{ fontWeight: 800, color: done ? '#15803D' : '#64748B' }}>
                        +50 XP
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleAddReview} style={styles.reviewBox}>
              <div style={styles.starsRow}>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Sua nota:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    style={{
                      ...styles.starBtn,
                      color: star <= newRating ? '#F59E0B' : '#CBD5E1',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div style={styles.reviewInputRow}>
                <input
                  style={styles.modalInput}
                  placeholder="Comente sobre o piso ou obstáculos..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  type="submit"
                  style={{
                    ...styles.sendBtn,
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                  }}
                >
                  Enviar
                </button>
              </div>
            </form>

            <div style={styles.reviewsList}>
              {detailSpot.reviews.map((rev) => (
                <div key={rev.id} style={styles.reviewCard}>
                  <div style={styles.reviewTop}>
                    <strong>{rev.author}</strong>
                    <span style={{ color: '#F59E0B' }}>{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL CADASTRAR NOVO PICO
          ==================================================================== */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <form
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateSpot}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.panelTitle}>Cadastrar Novo Pico</h2>
              <button
                type="button"
                style={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <input
              style={styles.formField}
              placeholder="Nome da pista ou pico"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              required
            />
            <input
              style={styles.formField}
              placeholder="Bairro ou Setor"
              value={spotZone}
              onChange={(e) => setSpotZone(e.target.value)}
              required
            />

            <div style={styles.twoColGrid}>
              <select
                style={styles.formField}
                value={spotType}
                onChange={(e) => setSpotType(e.target.value as SpotCategory)}
              >
                <option value="Street">Street</option>
                <option value="Plaza">Plaza</option>
                <option value="Bowl">Bowl</option>
                <option value="DIY">DIY</option>
              </select>

              <select
                style={styles.formField}
                value={spotLevel}
                onChange={(e) => setSpotLevel(e.target.value as SpotLevel)}
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <input
              style={styles.formField}
              placeholder="Obstáculos (ex: Corrimão, Borda, Gap)"
              value={spotObstacles}
              onChange={(e) => setSpotObstacles(e.target.value)}
            />

            <button
              type="submit"
              style={{
                ...styles.ctaPrimary,
                backgroundColor: theme.accent,
                color: theme.accentText,
                width: '100%',
                marginTop: '14px',
              }}
            >
              Salvar Pico no Radar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  brandStar: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '20px',
    letterSpacing: '0.8px',
    lineHeight: 1.05,
  },
  brandSub: {
    fontSize: '11px',
    color: '#E2E8F0',
    fontWeight: 700,
  },
  deskNavBtn: {
    background: 'transparent',
    border: '1px solid transparent',
    color: '#E2E8F0',
    padding: '7px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  deskNavBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    color: '#FFFFFF',
  },
  themeToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    borderRadius: '10px',
    padding: '7px 10px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  addBtn: {
    border: '1.5px solid #FFFFFF',
    borderRadius: '10px',
    padding: '7px 12px',
    fontSize: '12px',
    fontWeight: 900,
    cursor: 'pointer',
  },

  /* Capa Pôster e Palco 3D */
  cloudTop: {
    position: 'absolute',
    top: '-10px',
    right: '-20px',
    width: '280px',
    height: '200px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  cloudBottom: {
    position: 'absolute',
    bottom: '20px',
    right: '-20px',
    width: '340px',
    height: '230px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  posterTopCopy: {
    maxWidth: '280px',
    fontFamily: "'Arial Narrow', 'Roboto Condensed', sans-serif",
    fontSize: '10px',
    fontWeight: 700,
    lineHeight: 1.25,
    color: 'rgba(255, 255, 255, 0.92)',
    textTransform: 'uppercase',
  },
  modelSelectorBar: {
    position: 'absolute',
    top: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    zIndex: 18,
    whiteSpace: 'nowrap',
  },
  modelPillBtn: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    borderRadius: '20px',
    padding: '4px 10px',
    fontSize: '10.5px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  comboCounterPill: {
    backgroundColor: '#111827',
    color: '#FBBF24',
    border: '1px solid #FBBF24',
    borderRadius: '20px',
    padding: '3px 8px',
    fontSize: '10.5px',
    fontWeight: 900,
  },
  trickToast: {
    position: 'absolute',
    top: '34px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '14px',
    letterSpacing: '1px',
    padding: '3px 14px',
    borderRadius: '20px',
    border: '2px solid #FFFFFF',
    zIndex: 20,
    whiteSpace: 'nowrap',
  },
  tricksGridBar: {
    position: 'absolute',
    bottom: '0px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '5px',
    width: '100%',
    maxWidth: '420px',
    zIndex: 18,
  },
  trickMiniBtn: {
    backgroundColor: 'rgba(17, 24, 39, 0.88)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.42)',
    borderRadius: '16px',
    padding: '4px 10px',
    fontSize: '10.5px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  posterLeftBlock: {
    maxWidth: '175px',
  },
  posterSideCopy: {
    fontFamily: "'Arial Narrow', 'Roboto Condensed', sans-serif",
    fontSize: '9.5px',
    fontWeight: 700,
    lineHeight: 1.25,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textShadow: '0 1px 4px rgba(10, 6, 28, 0.65)',
  },
  posterQuote: {
    textAlign: 'right',
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: '12.5px',
    lineHeight: 1.25,
    color: '#1E1B4B',
  },
  posterButtonsRow: {
    display: 'flex',
    gap: '10px',
    maxWidth: '460px',
    width: '100%',
    margin: '0 auto',
    zIndex: 15,
  },
  ctaPrimary: {
    flex: 1,
    border: '2px solid #FFFFFF',
    borderRadius: '12px',
    padding: '11px 16px',
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '15px',
    letterSpacing: '0.8px',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10, 6, 28, 0.35)',
  },
  ctaSecondary: {
    backgroundColor: '#111827',
    color: '#FFFFFF',
    border: '2px solid #FFFFFF',
    borderRadius: '12px',
    padding: '11px 16px',
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '15px',
    letterSpacing: '0.8px',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(10, 6, 28, 0.35)',
  },
  bottomShards: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '75px',
    zIndex: 3,
    pointerEvents: 'none',
  },

  /* Cards e Controles */
  controlsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: '16px',
    padding: '14px',
    boxShadow: '0 8px 20px rgba(10, 6, 28, 0.25)',
  },
  searchInput: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
  },
  chipsRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    marginTop: '10px',
    paddingBottom: '2px',
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    border: '1px solid #D1D5DB',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  spotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 22px rgba(10, 6, 28, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeaderBanner: {
    padding: '14px 16px',
    cursor: 'pointer',
  },
  cardBannerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  orangeBadge: {
    fontSize: '10px',
    fontWeight: 900,
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  },
  liveRidersPill: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#86EFAC',
  },
  ratingBadge: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: '12px',
    fontWeight: 800,
    padding: '2px 8px',
    borderRadius: '8px',
  },
  cardTitle: {
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '21px',
    color: '#FFFFFF',
    letterSpacing: '0.5px',
  },
  cardBody: {
    padding: '14px 16px',
    color: '#111827',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSub: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  cardFloor: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '2px',
  },
  favBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: 1,
  },
  obstaclesWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '10px',
  },
  obstacleTag: {
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    border: '1px solid #E5E7EB',
    fontSize: '11px',
    fontWeight: 700,
    padding: '4px 8px',
    borderRadius: '6px',
  },
  challengeProgressBar: {
    marginTop: '10px',
    padding: '7px 10px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '12px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardOpenBtn: {
    marginTop: '12px',
    width: '100%',
    backgroundColor: '#111827',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  /* Mapa */
  mapBoard: {
    position: 'relative',
    width: '100%',
    height: '360px',
    borderRadius: '18px',
    overflow: 'hidden',
    border: '3px solid #FFFFFF',
    boxShadow: '0 10px 26px rgba(10, 6, 28, 0.35)',
  },
  mapSvg: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  userMarker: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '2px solid #A3E635',
    transform: 'translate(-50%, -50%)',
    zIndex: 8,
  },
  pinBtn: {
    position: 'absolute',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.15s ease',
  },
  pinTag: {
    fontSize: '11px',
    fontWeight: 800,
    padding: '5px 9px',
    borderRadius: '10px',
    border: '1.5px solid #FFFFFF',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 10px rgba(0,0,0,0.45)',
  },
  pinTip: {
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '7px solid #111827',
  },
  selectedMapPanel: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 10px 26px rgba(10, 6, 28, 0.28)',
  },
  panelTitle: {
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '22px',
    color: '#111827',
    marginTop: '4px',
  },
  panelButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '14px',
  },
  checkInBtn: {
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  /* Perfil & Setup */
  whiteCard: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 10px 24px rgba(10, 6, 28, 0.25)',
  },
  avatarBox: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginTop: '14px',
  },
  statMiniBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: '12px',
    padding: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
  },
  subHeading: {
    fontFamily: "Impact, 'Arial Black', sans-serif",
    fontSize: '18px',
    color: '#111827',
  },
  setupGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '6px',
    marginTop: '8px',
  },
  setupLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#4B5563',
    marginTop: '6px',
  },
  trickGuideItem: {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '10px 12px',
  },

  /* Mobile Nav */
  mobNavBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    fontSize: '11px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  /* Modais */
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
  },
  closeBtn: {
    backgroundColor: '#E5E7EB',
    color: '#374151',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    fontWeight: 800,
    cursor: 'pointer',
  },
  blueprintBox: {
    marginTop: '12px',
    backgroundColor: '#111827',
    borderRadius: '14px',
    padding: '8px',
    position: 'relative',
  },
  blueprintLabel: {
    position: 'absolute',
    top: '8px',
    left: '10px',
    fontSize: '10px',
    fontWeight: 800,
    color: '#E5E7EB',
  },
  challengesBox: {
    marginTop: '12px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '12px',
  },
  challengeItemBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '9px 11px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
  },
  reviewBox: {
    marginTop: '12px',
    backgroundColor: '#F3F4F6',
    padding: '12px',
    borderRadius: '12px',
  },
  starsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
  },
  starBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  reviewInputRow: {
    display: 'flex',
    gap: '8px',
  },
  modalInput: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
  },
  sendBtn: {
    border: 'none',
    borderRadius: '8px',
    padding: '0 14px',
    fontWeight: 800,
    fontSize: '12px',
    cursor: 'pointer',
  },
  reviewsList: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    padding: '10px 12px',
  },
  reviewTop: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  formField: {
    width: '100%',
    marginTop: '4px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#111827',
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '6px',
  },
};