import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'app-skins',
    templateUrl: './skins.component.html',
    styleUrls: ['./skins.component.scss'],
    standalone: false
})
export class SkinsComponent implements OnInit {

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

 /* private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private x: number = 1000;
  private y: number = 800;

  private initialCameraPosition = new THREE.Vector3(0, 0, 600);
  private initialCameraRotation = new THREE.Euler(0, 0, 0);*/

  constructor() { }

  ngOnInit(): void {
    this.initializeScene();
    //this.animate();
  }

  private initializeScene(): void {

  }
    /*this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 60, this.x / this.y, 1, 100000 );
    this.camera.position.set(0, 0, 600);  // Przykładowa pozycja kamery
    this.scene.add( this.camera );

    const ambientLight = new THREE.AmbientLight( 0xFFFFFF);
    ambientLight.intensity = 1.2
    this.scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0.534, 50.666, -1.520);
    this.scene.add(directionalLight);*/

    /*const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(-0.673, 0.560, -0.484);
    this.scene.add(directionalLight2);*/

    /*const mtlLoader = new MTLLoader();
    mtlLoader.load("assets/skins/models/cien/cien.mtl", (materials) => {
      materials.preload();

      // Powiązanie materiałów z modelem OBJ
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        "assets/skins/models/cien/cien.obj",
        (object) => {
          this.scene.add(object); // Dodanie obiektu do sceny
          object.position.set(0, -150, 0);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% załadowane');
        },
        (error) => {
          console.error('Wystąpił błąd przy ładowaniu pliku .obj:', error);
        }
      );
    });


    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( this.x, this.y );
    this.rendererContainer.nativeElement.appendChild( this.renderer.domElement );

    /*this.controls = new TrackballControls( this.camera, this.renderer.domElement );
    this.controls.rotateSpeed = 2;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    // Włącz/wyłącz funkcje
    this.controls.noZoom = false;    // Włącz zoom
    this.controls.noPan = false;     // Włącz przesuwanie
    this.controls.staticMoving = true; // Płynniejsze ruchy (true oznacza brak bezwładności)
    this.controls.dynamicDampingFactor = 0.3; // Tłumienie bezwładności

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;  // Włącz płynne obracanie
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;  // Zablokowanie przesuwania
    //this.controls.maxPolarAngle = Math.PI / 2;  // Ograniczenie obrotu

    // Obsługa myszy
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,  // Obrót kamery
      MIDDLE: THREE.MOUSE.DOLLY, // Zoom za pomocą scrolla
      RIGHT: THREE.MOUSE.PAN     // Przesuwanie kamery
    };

  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  resetCamera(): void {
    this.camera.position.copy(this.initialCameraPosition);
    this.camera.rotation.copy(this.initialCameraRotation);

    // Resetowanie celu (target) kamery
    this.controls.target.set(0, 0, 0);  // Kamera z powrotem patrzy na środek sceny

    // Zresetowanie zoomu i przesunięcia
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;

    this.controls.update();
  }*/


  /*@HostListener("window:resize", ["$event"]) onWindowResize(event: Event) {
    const SCREEN_WIDTH = 800;
    const SCREEN_HEIGHT = 600;
    this.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    this.camera.updateProjectionMatrix();
    this.render();
  }*/

}
