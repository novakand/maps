export class GoogleStyleMap {

  public style: google.maps.MapTypeStyle[];

  constructor() {
    this.style = [
      {
        featureType: 'administrative',
        elementType: 'all',
        stylers: [
          {
            saturation: -100,
          },
        ],
      },
      {
        featureType: 'administrative.province',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'landscape',
        elementType: 'all',
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 65,
          },
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 50,
          },
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'poi.attraction',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.attraction',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.business',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.business',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.government',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.government',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.medical',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.medical',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.place_of_worship',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.place_of_worship',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.school',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.school',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'poi.sports_complex',
        elementType: 'labels.text.fill',
        stylers: [
          {
            gamma: 0.30,
          },
        ],
      },
      {
        featureType: 'poi.sports_complex',
        elementType: 'labels.icon',
        stylers: [
          {
            gamma: 0.60,
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'all',
        stylers: [
          {
            saturation: -100,
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'all',
        stylers: [
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'all',
        stylers: [
          {
            lightness: 30,
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'all',
        stylers: [
          {
            lightness: 40,
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'all',
        stylers: [
          {
            saturation: -100,
          },
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            hue: '#ffff00',
          },
          {
            lightness: -25,
          },
          {
            saturation: -97,
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            gamma: 1.80,
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [
          {
            lightness: -25,
          },
          {
            saturation: -100,
          },
        ],
      },
    ];
  }

}

