export function createPlatforms(
  Platform,
  platformWidth,
  smallTall,
  newPlatform,
  platform,
  curvedLrgPlatform,
  balloon,
  pig1,
  pig2
) {
  return [
    new Platform({ x: -1, y: 580, image: platform }),
    new Platform({ x: platformWidth - 3, y: 580, image: platform }),
    new Platform({ x: platformWidth * 2 + 100, y: 580, image: platform }),
    new Platform({ x: platformWidth * 3 + 300, y: 580, image: platform }),
    new Platform({ x: platformWidth * 4 - 3 + 585, y: 475, image: smallTall }),
    new Platform({ x: platformWidth * 4 - 3 + 300, y: 580, image: platform }),
    new Platform({
      x: platformWidth * 5 - 3 + 600,
      y: 300,
      image: curvedLrgPlatform,
    }),

    new Platform({ x: platformWidth * 6 - 3 + 750, y: 580, image: platform }),
    new Platform({
      x: platformWidth * 7 - 3 + 585,
      y: 180,
      image: newPlatform,
    }),
    new Platform({
      x: platformWidth * 7 - 3 + 850,
      y: 400,
      image: curvedLrgPlatform,
    }),
    new Platform({
      x: platformWidth * 8 - 3 + 950,
      y: 200,
      image: newPlatform,
    }),

    new Platform({
      x: platformWidth * 9 - 3 + 950,
      y: 580,
      image: platform,
    }),
    new Platform({
      x: platformWidth * 10 - 6 + 950,
      y: 580,
      image: platform,
    }),
  ];
}

export function createGenericObjects(GenericObject, bg, hills) {
  return [
    new GenericObject({ x: -1, y: 0, image: bg }),
    new GenericObject({ x: -1, y: 200, image: hills }),
  ];
}

export function createCoins(Collectible, platformWidth, coin) {
  return [
    new Collectible({ x: 600, y: 300, image: coin }),
    new Collectible({ x: 700, y: 200, image: coin }),
    new Collectible({ x: platformWidth * 5 + 625, y: 260, image: coin }),
    new Collectible({ x: platformWidth * 7 - 3 + 585, y: 120, image: coin }),
    new Collectible({ x: platformWidth * 7 + 875, y: 360, image: coin }),
    new Collectible({ x: platformWidth * 8 + 975, y: 160, image: coin }),
  ];
}

export function createProps(Props, platformWidth, pig1, pig2, balloon) {
  return [
    new Props({
      x: platformWidth * 9 - 6 + 875,
      y: 300,
      image: balloon,
    }),
    new Props({
      x: platformWidth * 10 - 6 + 1150,
      y: 445,
      image: pig2,
    }),
    new Props({
      x: platformWidth * 11 - 6 + 750,
      y: 300,
      image: balloon,
    }),
  ];
}
