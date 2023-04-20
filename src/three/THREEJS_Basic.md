---
title: THREE基础
order: 1
category: false
---



## 官网

英文官网：https://threejs.org/

## 介绍

Three.js 是一个基于 WebGL 的 js 开源框架，由 Ricardo Cabello 在 2010 四月于 GitHub 首次发布，目前在 GitHub 上 star 数量已经达到了 89.4k。

Threejs 对 WebGL 进行了封装，让前端开发人员在不需要掌握很多数学知识和绘图知识的情况下，也能够轻松进行 web 3D 开发，降低了门槛，同时大大提升了效率。

## 基础应用结构

![three_structure](https://misaka10032.oss-cn-chengdu.aliyuncs.com/three/structure.png)

如图所示，threejs基本应用结构主要有Renderer、Scene、Camera三大要素。

Renderer渲染器负责将你提供的所有数据渲染绘制到canvas上。

注意图中摄像机(Camera)和其他对象不同的是，它不一定要在场景图中才能起作用。

Scene场景是three.js的基本的组成部分。需要three.js绘制的东西都需要加入到scene中。

# 基础

## 创建第一个场景

```html
	<head>
		<meta charset="utf-8">
		<title>第一个3D页面</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body>
		<script type="module">
			import * as THREE from 'https://unpkg.com/three/build/three.module.js';
			
			// 设置场景
			const scene = new THREE.Scene();
			// 设置相机
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
			// 设置渲染器
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			// 把three添加进body
			document.body.appendChild( renderer.domElement );
			
			// 创建集合体
			const geometry = new THREE.BoxGeometry( 1, 1, 1 );
			// 创建集合体材质
			const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			// 网格对象
			const cube = new THREE.Mesh( geometry, material );
			// 把网格对象加入场景
			scene.add( cube );

			camera.position.z = 5;
			
			// 帧循环函数
			function animate() {
				requestAnimationFrame( animate );

				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;
				// 调用render方法渲染3d
				renderer.render( scene, camera );
			}

			animate();
		</script>
	</body>
```

接下来再来介绍一个完整3D世界的组成部分！

## Geometry（几何体）

几何体就是一些3D形状，THREEJS有很多几何体，在运行时根据大量参数生成。

下面是一些常用的几何体：

* ​			BoxGeometry --- 立体缓冲集合体

  ```text
  BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
  width — X轴上面的宽度，默认值为1。
  height — Y轴上面的高度，默认值为1。
  depth — Z轴上面的深度，默认值为1。
  widthSegments — （可选）宽度的分段数，默认值是1。
  heightSegments — （可选）高度的分段数，默认值是1。
  depthSegments — （可选）深度的分段数，默认值是1。
  ```

  

* ​         SphereGeometry --- 球缓冲几何体

  ```
  SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
  radius — 球体半径，默认为1。
  widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为32。
  heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为16。
  phiStart — 指定水平（经线）起始角度，默认值为0。。
  phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
  thetaStart — 指定垂直（纬线）起始角度，默认值为0。
  thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI。
  该几何体是通过扫描并计算围绕着Y轴（水平扫描）和X轴（垂直扫描）的顶点来创建的。 因此，不完整的球体（类似球形切片）可以通过为phiStart，phiLength，thetaStart和thetaLength设置不同的值来创建， 以定义我们开始（或结束）计算这些顶点的起点（或终点）。
  ```

* ​       PlaneGeometry ----  平面缓冲几何体

  ```
  PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
  width — 平面沿着X轴的宽度。默认值是1。
  height — 平面沿着Y轴的高度。默认值是1。
  widthSegments — （可选）平面的宽度分段数，默认值是1。
  heightSegments — （可选）平面的高度分段数，默认值是1。
  ```

* ​    BufferGeometry   ---  自定义缓冲几何体

  ```js
  const geometry = new THREE.BufferGeometry();
  // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
  // 因为在两个三角面片里，这两个顶点都需要被用到。
  const vertices = new Float32Array( [
  	-1.0, -1.0,  1.0,
  	 1.0, -1.0,  1.0,
  	 1.0,  1.0,  1.0,
  
  	 1.0,  1.0,  1.0,
  	-1.0,  1.0,  1.0,
  	-1.0, -1.0,  1.0
  ] );
  
  // itemSize = 3 因为每个顶点都是一个三元组。
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const mesh = new THREE.Mesh( geometry, material );
  ```



## Scene（场景）

Three.js 的核心可以说是它的场景图（scene graph）。场景图在 3D 引擎是一个图中节点的层次结构，其中每个节点代表了一个局部空间（local space）。

场景能够让你在什么地方、摆放什么东西来交给three.js来渲染，这是你放置物体、灯光和摄像机的地方。



|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [background](https://threejs.org/docs/index.html#api/zh/scenes/Scene.background) : Object | 若不为空，在渲染场景的时候将设置背景，且背景总是首先被渲染的 |
| [environment](https://threejs.org/docs/index.html#api/zh/scenes/Scene.environment) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 若该值不为null，则该纹理贴图将会被设为场景中所有物理材质的环境贴图。 |
| [fog](https://threejs.org/docs/index.html#api/zh/scenes/Scene.fog) : [Fog](https://threejs.org/docs/index.html#api/zh/scenes/Fog) | 一个[fog](https://threejs.org/docs/index.html#api/zh/scenes/Fog)实例定义了影响场景中的每个物体的雾的类型。默认值为null。 |
| [isScene](https://threejs.org/docs/index.html#api/zh/scenes/Scene.isScene) : Boolean |                   判断一个对象是否是Scene                    |

## Material（材质）

Three.js提供了多种类型的材质（material）。它们定义了对象在场景中的外型。你使用哪种材质取决于你想达到的目的。材质描述了对象objects的外观。它们的定义方式与渲染器无关， 因此，如果决定使用不同的渲染器，不必重写材质。

> **注：我会在下面列出一些常用的材质以及一些常用的属性，对比各种材质的优劣势不同**

### Material

材质的抽象基类。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [name](https://threejs.org/docs/index.html#api/zh/materials/Material.name) : String |      对象的可选名称（不必是唯一的）。默认值为空字符串。      |
| [visible](https://threejs.org/docs/index.html#api/zh/materials/Material.visible) : Boolean |               此材质是否可见。默认为**true**。               |
| [vertexColors](https://threejs.org/docs/index.html#api/zh/materials/Material.vertexColors) : Boolean |              是否使用顶点着色。默认值为false。               |
| [side](https://threejs.org/docs/index.html#api/zh/materials/Material.side) : Integer | 定义将要渲染哪一面 - 正面，背面或两者。 默认为[THREE.FrontSide](https://threejs.org/docs/index.html#api/zh/constants/Materials)。其他选项有[THREE.BackSide](https://threejs.org/docs/index.html#api/zh/constants/Materials) 和 [THREE.DoubleSide](https://threejs.org/docs/index.html#api/zh/constants/Materials)。 |
| [opacity](https://threejs.org/docs/index.html#api/zh/materials/Material.opacity) : Float | 在0.0 - 1.0的范围内的浮点数，表明材质的透明度。值**0.0**表示完全透明，**1.0**表示完全不透明。<br/>如果材质的transparent属性未设置为**true**，则材质将保持完全不透明，此值仅影响其颜色。 默认值为**1.0**。 |
| [needsUpdate](https://threejs.org/docs/index.html#api/zh/materials/Material.needsUpdate) : Boolean |                     指定需要重新编译材质                     |
| [isMaterial](https://threejs.org/docs/index.html#api/zh/materials/Material.isMaterial) : Boolean |          检查这个对象是否为材质Material的只读标记.           |
| [depthWrite](https://threejs.org/docs/index.html#api/zh/materials/Material.depthWrite) : Boolean |    渲染此材质是否对深度缓冲区有任何影响。默认为**true**。    |
| [depthTest](https://threejs.org/docs/index.html#api/zh/materials/Material.depthTest) : Boolean |      是否在渲染此材质时启用深度测试。默认为 **true**。       |
| [blending](https://threejs.org/docs/index.html#api/zh/materials/Material.blending) : Blending | 在使用此材质显示对象时要使用何种混合。默认值为NormalBlending。可选值有：THREE.NoBlending、THREE.NormalBlending、THREE.AdditiveBlending、THREE.SubtractiveBlending、THREE.MultiplyBlending、THREE.CustomBlending |
| [alphaTest](https://threejs.org/docs/index.html#api/zh/materials/Material.alphaTest) : Float | 设置运行alphaTest时要使用的alpha值。如果不透明度低于此值，则不会渲染材质。默认值为**0**。 |

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [clone](https://threejs.org/docs/index.html#api/zh/materials/Material.clone) ( ) : [Material](https://threejs.org/docs/index.html#api/zh/materials/Material) |              返回与此材质具有相同参数的新材质。              |
| [copy](https://threejs.org/docs/index.html#api/zh/materials/Material.copy) ( material : material ) : this |             将被传入材质中的参数复制到此材质中。             |
| [dispose](https://threejs.org/docs/index.html#api/zh/materials/Material.dispose) () : undefined | 处理材质。材质的纹理不会被处理。需要通过[Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture)处理。 |
| [setValues](https://threejs.org/docs/index.html#api/zh/materials/Material.setValues) ( values : Object ) : undefined |     values -- 具有参数的容器。 根据**values**设置属性。      |
|                                                              |                                                              |



### MeshBasicMaterial

一个以简单着色（平面或线框）方式来绘制几何体的材质。该材质不受光照影响。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [alphaMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.alphaMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。 |
| [aoMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。 |
| [aoMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMapIntensity) : Float |       环境遮挡效果的强度。默认值为1。零是不遮挡效果。        |
| [color](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.color) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的颜色([Color](https://threejs.org/docs/index.html#api/zh/math/Color))，默认值为白色 (0xffffff)。 |
| [envMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.envMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |                   环境贴图。默认值为null。                   |
| [fog](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.fog) : Boolean |               材质是否受雾影响。默认为**true**               |
| [lightMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |         光照贴图。默认值为null。lightMap需要第二组UV         |
| [lightMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMapIntensity) : Float |                  烘焙光的强度。默认值为1。                   |
| [map](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.map) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 颜色贴图。可以选择包括一个alpha通道，通常与[.transparent](https://threejs.org/docs/index.html#api/zh/materials/Material.transparent) 或[.alphaTest](https://threejs.org/docs/index.html#api/zh/materials/Material.alphaTest)。默认为null。 |
| [reflectivity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.reflectivity) : Float | 环境贴图对表面的影响程度; 见[.combine](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.combine)。默认值为1，有效范围介于0（无反射）和1（完全反射）之间。 |
| [specularMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.specularMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |              材质使用的高光贴图。默认值为null。              |
| [wireframe](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.wireframe) : Boolean | 将几何体渲染为线框。默认值为**false**（即渲染为平面多边形）。 |



### MeshLambertMaterial

一种非光泽表面的材质，没有镜面高光。该材质使用基于非物理的[Lambertian](https://en.wikipedia.org/wiki/Lambertian_reflectance)模型来计算反射率。 这可以很好地模拟一些表面（例如未经处理的木材或石材），但不能模拟具有镜面高光的光泽表面（例如涂漆木材）。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [alphaMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.alphaMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。 |
| [aoMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。 |
| [aoMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMapIntensity) : Float |       环境遮挡效果的强度。默认值为1。零是不遮挡效果。        |
| [color](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.color) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的颜色([Color](https://threejs.org/docs/index.html#api/zh/math/Color))，默认值为白色 (0xffffff)。 |
| [envMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.envMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |                   环境贴图。默认值为null。                   |
| [fog](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.fog) : Boolean |               材质是否受雾影响。默认为**true**               |
| [lightMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |         光照贴图。默认值为null。lightMap需要第二组UV         |
| [lightMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMapIntensity) : Float |                  烘焙光的强度。默认值为1。                   |
| [map](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.map) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 颜色贴图。可以选择包括一个alpha通道，通常与[.transparent](https://threejs.org/docs/index.html#api/zh/materials/Material.transparent) 或[.alphaTest](https://threejs.org/docs/index.html#api/zh/materials/Material.alphaTest)。默认为null。 |
| [reflectivity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.reflectivity) : Float | 环境贴图对表面的影响程度; 见[.combine](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.combine)。默认值为1，有效范围介于0（无反射）和1（完全反射）之间。 |
| [specularMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.specularMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |              材质使用的高光贴图。默认值为null。              |
| [wireframe](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.wireframe) : Boolean | 将几何体渲染为线框。默认值为**false**（即渲染为平面多边形）。 |
| [bumpMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.bumpMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 用于创建凹凸贴图的纹理。黑色和白色值映射到与光照相关的感知深度。凹凸实际上不会影响对象的几何形状，只影响光照。如果定义了法线贴图，则将忽略该贴图。 |
| [bumpScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.bumpScale) : Float |   凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。   |
| [displacementMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。 |
| [displacementScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementScale) : Float | 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1。 |
| [displacementBias](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementBias) : Float | 位移贴图在网格顶点上的偏移量。如果没有设置位移贴图，则不会应用此值。默认值为0。 |
| [emissive](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissive) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。 |
| [emissiveMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissiveMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 如果你有一个放射贴图，请务必将放射颜色设置为黑色以外的其他颜色。 |
| [emissiveIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissiveIntensity) : Float |             放射光强度。调节发光颜色。默认为1。              |
| [normalMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.normalMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照 |
| [normalScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.normalScale) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) | 法线贴图对材质的影响程度。典型范围是0-1。默认值是[Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2)设置为（1,1）。 |

### MeshPhongMaterial

一种用于具有镜面高光的光泽表面的材质。该材质使用非物理的[Blinn-Phong](https://en.wikipedia.org/wiki/Blinn-Phong_shading_model)模型来计算反射率。 与[MeshLambertMaterial](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial)中使用的Lambertian模型不同，该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [alphaMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.alphaMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。 |
| [aoMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。 |
| [aoMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMapIntensity) : Float |       环境遮挡效果的强度。默认值为1。零是不遮挡效果。        |
| [color](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.color) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的颜色([Color](https://threejs.org/docs/index.html#api/zh/math/Color))，默认值为白色 (0xffffff)。 |
| [envMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.envMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |                   环境贴图。默认值为null。                   |
| [fog](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.fog) : Boolean |               材质是否受雾影响。默认为**true**               |
| [lightMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |         光照贴图。默认值为null。lightMap需要第二组UV         |
| [lightMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMapIntensity) : Float |                  烘焙光的强度。默认值为1。                   |
| [map](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.map) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 颜色贴图。可以选择包括一个alpha通道，通常与[.transparent](https://threejs.org/docs/index.html#api/zh/materials/Material.transparent) 或[.alphaTest](https://threejs.org/docs/index.html#api/zh/materials/Material.alphaTest)。默认为null。 |
| [reflectivity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.reflectivity) : Float | 环境贴图对表面的影响程度; 见[.combine](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.combine)。默认值为1，有效范围介于0（无反射）和1（完全反射）之间。 |
| [specularMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.specularMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |              材质使用的高光贴图。默认值为null。              |
| [specular](https://threejs.org/docs/index.html#api/zh/materials/MeshPhongMaterial.specular) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的高光颜色。默认值为**0x111111**（深灰色）的颜色[Color](https://threejs.org/docs/index.html#api/zh/math/Color)。这定义了材质的光泽度和光泽的颜色。 |
| [shininess](https://threejs.org/docs/index.html#api/zh/materials/MeshPhongMaterial.shininess) : Float | [specular](https://threejs.org/docs/index.html#api/zh/materials/MeshPhongMaterial.specular)高亮的程度，越高的值越闪亮。默认值为 **30**。 |
| [wireframe](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.wireframe) : Boolean | 将几何体渲染为线框。默认值为**false**（即渲染为平面多边形）。 |
| [bumpMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.bumpMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 用于创建凹凸贴图的纹理。黑色和白色值映射到与光照相关的感知深度。凹凸实际上不会影响对象的几何形状，只影响光照。如果定义了法线贴图，则将忽略该贴图。 |
| [bumpScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.bumpScale) : Float |   凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。   |
| [displacementMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。 |
| [displacementScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementScale) : Float | 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1。 |
| [displacementBias](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementBias) : Float | 位移贴图在网格顶点上的偏移量。如果没有设置位移贴图，则不会应用此值。默认值为0。 |
| [emissive](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissive) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。 |
| [emissiveMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissiveMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 如果你有一个放射贴图，请务必将放射颜色设置为黑色以外的其他颜色。 |
| [emissiveIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissiveIntensity) : Float |             放射光强度。调节发光颜色。默认为1。              |
| [normalMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.normalMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照 |
| [normalScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.normalScale) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) | 法线贴图对材质的影响程度。典型范围是0-1。默认值是[Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2)设置为（1,1）。 |

### MeshStandardMaterial

一种基于物理的标准材质，使用Metallic-Roughness工作流程。基于物理的渲染（PBR）最近已成为许多3D应用程序的标准，例如[Unity](https://blogs.unity3d.com/2014/10/29/physically-based-shading-in-unity-5-a-primer/)， [Unreal](https://docs.unrealengine.com/latest/INT/Engine/Rendering/Materials/PhysicallyBased/)和 [3D Studio Max](http://area.autodesk.com/blogs/the-3ds-max-blog/what039s-new-for-rendering-in-3ds-max-2017)。这种方法与旧方法的不同之处在于，不使用近似值来表示光与表面的相互作用，而是使用物理上正确的模型。 我们的想法是，不是在特定照明下调整材质以使其看起来很好，而是可以创建一种材质，能够“正确”地应对所有光照场景。在实践中，该材质提供了比[MeshLambertMaterial](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial) 或[MeshPhongMaterial](https://threejs.org/docs/index.html#api/zh/materials/MeshPhongMaterial) 更精确和逼真的结果，代价是计算成本更高。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [alphaMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.alphaMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。 |
| [aoMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。 |
| [aoMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.aoMapIntensity) : Float |       环境遮挡效果的强度。默认值为1。零是不遮挡效果。        |
| [color](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.color) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的颜色([Color](https://threejs.org/docs/index.html#api/zh/math/Color))，默认值为白色 (0xffffff)。 |
| [envMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.envMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |                   环境贴图。默认值为null。                   |
| [fog](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.fog) : Boolean |               材质是否受雾影响。默认为**true**               |
| [lightMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |         光照贴图。默认值为null。lightMap需要第二组UV         |
| [lightMapIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.lightMapIntensity) : Float |                  烘焙光的强度。默认值为1。                   |
| [map](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.map) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 颜色贴图。可以选择包括一个alpha通道，通常与[.transparent](https://threejs.org/docs/index.html#api/zh/materials/Material.transparent) 或[.alphaTest](https://threejs.org/docs/index.html#api/zh/materials/Material.alphaTest)。默认为null。 |
| [reflectivity](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.reflectivity) : Float | 环境贴图对表面的影响程度; 见[.combine](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.combine)。默认值为1，有效范围介于0（无反射）和1（完全反射）之间。 |
| [specularMap](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.specularMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |              材质使用的高光贴图。默认值为null。              |
| [specular](https://threejs.org/docs/index.html#api/zh/materials/MeshPhongMaterial.specular) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的高光颜色。默认值为**0x111111**（深灰色）的颜色[Color](https://threejs.org/docs/index.html#api/zh/math/Color)。这定义了材质的光泽度和光泽的颜色。 |
| [wireframe](https://threejs.org/docs/index.html#api/zh/materials/MeshBasicMaterial.wireframe) : Boolean | 将几何体渲染为线框。默认值为**false**（即渲染为平面多边形）。 |
| [bumpMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.bumpMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 用于创建凹凸贴图的纹理。黑色和白色值映射到与光照相关的感知深度。凹凸实际上不会影响对象的几何形状，只影响光照。如果定义了法线贴图，则将忽略该贴图。 |
| [bumpScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.bumpScale) : Float |   凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。   |
| [displacementMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。 |
| [displacementScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementScale) : Float | 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1。 |
| [displacementBias](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.displacementBias) : Float | 位移贴图在网格顶点上的偏移量。如果没有设置位移贴图，则不会应用此值。默认值为0。 |
| [emissive](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissive) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。 |
| [emissiveMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissiveMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 如果你有一个放射贴图，请务必将放射颜色设置为黑色以外的其他颜色。 |
| [emissiveIntensity](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.emissiveIntensity) : Float |             放射光强度。调节发光颜色。默认为1。              |
| [normalMap](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.normalMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照 |
| [normalScale](https://threejs.org/docs/index.html#api/zh/materials/MeshLambertMaterial.normalScale) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) | 法线贴图对材质的影响程度。典型范围是0-1。默认值是[Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2)设置为（1,1）。 |
| .[isMeshStandardMaterial](https://threejs.org/docs/index.html#api/zh/materials/MeshStandardMaterial.isMeshStandardMaterial) : Boolean |            检查当前对象是否为标准网格材质的标记。            |
| [metalness](https://threejs.org/docs/index.html#api/zh/materials/MeshStandardMaterial.metalness) : Float | 材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘。 |
| [metalnessMap](https://threejs.org/docs/index.html#api/zh/materials/MeshStandardMaterial.metalnessMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |            该纹理的蓝色通道用于改变材质的金属度。            |
| [roughnessMap](https://threejs.org/docs/index.html#api/zh/materials/MeshStandardMaterial.roughnessMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |            该纹理的绿色通道用于改变材质的粗糙度。            |
| [roughness](https://threejs.org/docs/index.html#api/zh/materials/MeshStandardMaterial.roughness) : Float | 材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。 |

### MeshPhysicalMaterial

[MeshStandardMaterial](https://threejs.org/docs/index.html#api/zh/materials/MeshStandardMaterial)的扩展，提供了更高级的基于物理的渲染属性：

* **Clearcoat:** 有些类似于车漆，碳纤，被水打湿的表面的材质需要在面上再增加一个透明的，具有一定反光特性的面。而且这个面说不定有一定的起伏与粗糙度。Clearcoat可以在不需要重新创建一个透明的面的情况下做到类似的效果。
* **基于物理的透明度**:[.opacity](https://threejs.org/docs/index.html#api/zh/materials/Material.opacity)属性有一些限制:在透明度比较高的时候，反射也随之减少。使用基于物理的透光性[.transmission](https://threejs.org/docs/index.html#api/zh/materials/MeshPhysicalMaterial.transmission)属性可以让一些很薄的透明表面，例如玻璃，变得更真实一些。
* **高级光线反射:** 为非金属材质提供了更多更灵活的光线反射。
* **Sheen:** Can be used for representing cloth and fabric materials.

物理网格材质使用了更复杂的着色器功能，所以在每个像素的渲染都要比three.js中的其他材质更费性能，大部分的特性是默认关闭的，需要手动开启，每开启一项功能在开启的时候才会更耗性能。

详细文档请查看：[MeshPhysicalMaterial](https://threejs.org/docs/?q=material#api/zh/materials/MeshPhysicalMaterial)

### 材质小结

[`MeshBasicMaterial`](https://threejs.org/docs/#api/zh/materials/MeshBasicMaterial) 不受光照的影响。[`MeshLambertMaterial`](https://threejs.org/docs/#api/zh/materials/MeshLambertMaterial) 只在顶点计算光照，而 [`MeshPhongMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial) 则在每个像素计算光照。[`MeshPhongMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial) 还支持镜面高光。

既然[`MeshBasicMaterial`](https://threejs.org/docs/#api/zh/materials/MeshBasicMaterial)、[`MeshLambertMaterial`](https://threejs.org/docs/#api/zh/materials/MeshLambertMaterial)可以做到的，[`MeshPhongMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial)也可以做到，那为什么还要有这3种材质呢？原因是更复杂的材质会消耗更多的GPU功耗。在一个较慢的GPU上，比如说手机，你可能想通过使用一个不太复杂的材质来减少绘制场景所需的GPU功耗。同样，如果你不需要额外的功能，那就使用最简单的材质。如果你不需要照明和镜面高光，那么就使用 [`MeshBasicMaterial`](https://threejs.org/docs/#api/zh/materials/MeshBasicMaterial) 。

接下来是2种基于物理渲染（*Physically Based Rendering*）的材质。Physically Based Rendering通常简称为PBR。

[`MeshPhongMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial) 和 [`MeshStandardMaterial`](https://threejs.org/docs/#api/zh/materials/MeshStandardMaterial) 最大的区别是它们使用的参数不同。[`MeshPhongMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial) 有一个参数用来设置 `shininess` 属性。[`MeshStandardMaterial`](https://threejs.org/docs/#api/zh/materials/MeshStandardMaterial) 有2个参数用来分别设置 `roughness` 和 `metalness` 属性。

[`MeshPhysicalMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhysicalMaterial) 与 [`MeshStandardMaterial`](https://threejs.org/docs/#api/zh/materials/MeshStandardMaterial) 相同，但它增加了一个`clearcoat` 参数，该参数从0到1，决定了要涂抹的清漆光亮层的程度，还有一个 `clearCoatRoughness` 参数，指定光泽层的粗糙程度。

各种标准材质的构建速度从最快到最慢：[`MeshBasicMaterial`](https://threejs.org/docs/#api/zh/materials/MeshBasicMaterial) ➡ [`MeshLambertMaterial`](https://threejs.org/docs/#api/zh/materials/MeshLambertMaterial) ➡ [`MeshPhongMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial) ➡ [`MeshStandardMaterial`](https://threejs.org/docs/#api/zh/materials/MeshStandardMaterial) ➡ [`MeshPhysicalMaterial`](https://threejs.org/docs/#api/zh/materials/MeshPhysicalMaterial)。构建速度越慢的材质，做出的场景越逼真，但在低功率或移动设备上，你可能需要思考代码的设计，使用构建速度较快的材质。

------

### PointsMaterial

[Points](https://threejs.org/docs/index.html#api/zh/objects/Points)也就是粒子系统使用的默认材质。

**代码示例**

```js
const vertices = [];

for ( let i = 0; i < 10000; i ++ ) {

	const x = THREE.MathUtils.randFloatSpread( 2000 );
	const y = THREE.MathUtils.randFloatSpread( 2000 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );

	vertices.push( x, y, z );

}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material = new THREE.PointsMaterial( { color: 0x888888 } );

const points = new THREE.Points( geometry, material );

scene.add( points );
```

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [alphaMap](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial.alphaMap) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。 默认值为null。 |
| [color](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial.color) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 材质的颜色([Color](https://threejs.org/docs/index.html#api/zh/math/Color))，默认值为白色 (0xffffff)。 |
| [fog](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial.fog) : Boolean |              材质是否受雾影响。默认为**true**。              |
| [map](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial.map) : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) | 使用来自[Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture)的数据设置点的颜色。可以选择包括一个alpha通道，通常与 [.transparent](https://threejs.org/docs/index.html#api/zh/materials/Material.transparent)或[.alphaTest](https://threejs.org/docs/index.html#api/zh/materials/Material.alphaTest)。 |
| [size](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial.size) : Number |                 设置点的大小。默认值为1.0。                  |
| [sizeAttenuation](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial.sizeAttenuation) : Boolean | 指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。 |

### ShaderMaterial

使用自定义shader渲染的材质。 shader是一个用[GLSL](https://www.khronos.org/files/opengles_shading_language.pdf)编写的小程序 ，在GPU上运行。如果你要实现内置 [materials](https://threejs.org/docs/index.html#api/zh/materials/Material) 之外的效果或者将许多对象组合成单个[BufferGeometry](https://threejs.org/docs/index.html#api/zh/core/BufferGeometry)以提高性能。可以使用shaderMaterial。

注：ShaderMaterial 只有使用 WebGLRenderer 才可以绘制正常， 因为 vertexShader 和 fragmentShader 属性中GLSL代码必须使用WebGL来编译并运行在GPU中。

**代码示例**

```js
const material = new THREE.ShaderMaterial( {

	uniforms: {

		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2() }

	},

	vertexShader: document.getElementById( 'vertexShader' ).textContent,

	fragmentShader: document.getElementById( 'fragmentShader' ).textContent

} );
```

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [defaultAttributeValues](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.defaultAttributeValues) : Object | 当渲染的几何体不包含这些属性但材质包含这些属性时，这些默认值将传递给shaders。这可以避免在缓冲区数据丢失时出错。 |
| [defines](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.defines) : Object | 使用 #define 指令在GLSL代码为顶点着色器和片段着色器定义自定义常量；每个键/值对产生一行定义语句 |
| [fog](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.fog) : Boolean | 定义材质颜色是否受全局雾设置的影响; 如果将fog uniforms传递给shader，则为true。默认值为false。 |
| [fragmentShader](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.fragmentShader) : String | 片元着色器的GLSL代码。这是shader程序的实际代码。它也可以作为一个字符串直接传递或者通过AJAX加载。 |
| [isShaderMaterial](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.isShaderMaterial) : Boolean |           检查当前对象是否为ShaderMaterial的标记。           |
| [lights](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.lights) : Boolean | 材质是否受到光照的影响。默认值为 **false**。如果传递与光照相关的uniform数据到这个材质，则为true。默认是false。 |
| [uniforms](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.uniforms) : Object | 如下形式的对象：{ "uniform1": { value: 1.0 }, "uniform2": { value: 2 } }这里 **value** 是uniform的值。名称必须匹配 uniform 的name，和GLSL代码中的定义一样。 注意，uniforms逐帧被刷新，所以更新uniform值将立即更新GLSL代码中的相应值。 |
| [uniformsNeedUpdate](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.uniformsNeedUpdate) : Boolean | 可用于在 Object3D.onBefore Render ()中更改制服时强制执行统一更新。默认值为 false。 |
| [vertexColors](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.vertexColors) : Boolean |             定义是否使用顶点着色。默认为 false。             |
| [vertexShader](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.vertexShader) : String | 顶点着色器的GLSL代码。这是shader程序的实际代码。它也可以作为一个字符串直接传递或者通过AJAX加载。 |
| [wireframe](https://threejs.org/docs/index.html#api/zh/materials/ShaderMaterial.wireframe) : Boolean | 将几何体渲染为线框(通过GL_LINES而不是GL_TRIANGLES)。默认值为**false**（即渲染为平面多边形） |

### 材质大结--材质特性表

|                       | [Basic](https://threejs.org/docs/#api/materials/MeshBasicMaterial) | [Lambert](https://threejs.org/docs/#api/materials/MeshLambertMaterial) | [Phong](https://threejs.org/docs/#api/materials/MeshPhongMaterial) | [Standard](https://threejs.org/docs/#api/materials/MeshStandardMaterial) | [Physical](https://threejs.org/docs/#api/materials/MeshPhysicalMaterial) |
| :-------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|       alphaMap        |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|         aoMap         |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|    aoMapIntensity     |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|   attenuationColor    |                                                              |                                                              |                                                              |                                                              |                              √                               |
|  attenuationDistance  |                                                              |                                                              |                                                              |                                                              |                              √                               |
|        bumpMap        |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|       bumpScale       |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|       clearcoat       |                                                              |                                                              |                                                              |                                                              |                              √                               |
|     clearcoatMap      |                                                              |                                                              |                                                              |                                                              |                              √                               |
|  clearcoatNormalMap   |                                                              |                                                              |                                                              |                                                              |                              √                               |
| clearcoatNormalScale  |                                                              |                                                              |                                                              |                                                              |                              √                               |
|  clearcoatRoughness   |                                                              |                                                              |                                                              |                                                              |                              √                               |
| clearcoatRoughnessMap |                                                              |                                                              |                                                              |                                                              |                              √                               |
|         color         |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|        combine        |                              √                               |                              √                               |                              √                               |                                                              |                                                              |
|   displacementBias    |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|    displacementMa     |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|   displacementScale   |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|       emissive        |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|   emissiveIntensity   |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|      emissiveMap      |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|        envMap         |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|    envMapIntensity    |                                                              |                                                              |                                                              |                              √                               |                              √                               |
|       lightMap        |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|   lightMapIntensity   |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|          map          |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|       metalness       |                                                              |                                                              |                                                              |                              √                               |                              √                               |
|     metalnessMap      |                                                              |                                                              |                                                              |                              √                               |                              √                               |
|       normalMap       |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|     normalMapType     |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|      normalScale      |                                                              |                              √                               |                              √                               |                              √                               |                              √                               |
|     reflectivity      |                              √                               |                              √                               |                              √                               |                                                              |                              √                               |
|    refractionRatio    |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |
|       roughness       |                                                              |                                                              |                                                              |                              √                               |                              √                               |
|     roughnessMap      |                                                              |                                                              |                                                              |                              √                               |                              √                               |
|       shininess       |                                                              |                                                              |                              √                               |                                                              |                                                              |
|       specular        |                                                              |                                                              |                              √                               |                                                              |                                                              |
|     specularColor     |                                                              |                                                              |                                                              |                                                              |                              √                               |
|   specularColorMap    |                                                              |                                                              |                                                              |                                                              |                              √                               |
|   specularIntensity   |                                                              |                                                              |                                                              |                                                              |                              √                               |
| specularIntensityMap  |                                                              |                                                              |                                                              |                                                              |                              √                               |
|      specularMap      |                              √                               |                              √                               |                              √                               |                                                              |                                                              |
|       thickness       |                                                              |                                                              |                                                              |                                                              |                              √                               |
|     thicknessMap      |                                                              |                                                              |                                                              |                                                              |                              √                               |
|     transmission      |                                                              |                                                              |                                                              |                                                              |                              √                               |
|    transmissionMap    |                                                              |                                                              |                                                              |                                                              |                              √                               |
|       wireframe       |                              √                               |                              √                               |                              √                               |                              √                               |                              √                               |

## Texture（纹理贴图）

创建一个纹理贴图，将其应用到一个表面，或者作为反射/折射贴图。

### 加载纹理

#### 简单的方法加载

在three中加载纹理是异步的，使用这个方法我们的纹理将是透明的，直到图片被three.js异步加载完成，这时它将用下载的图片更新纹理。这有一个很大的好处，就是我们不必等待纹理加载，我们的页面会立即开始渲染。

**代码示例**

```js
const texture = loader.load('resources/images/flower-1.jpg');
```

#### 等待一个纹理加载

为了等待贴图加载，贴图加载器的 `load` 方法会在贴图加载完成后调用一个回调。

**代码示例**

```js
const loader = new THREE.TextureLoader();
loader.load('resources/images/wall.jpg', (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
});
```

#### 等待多个纹理加载

要等到所有纹理都加载完毕，可以使用 [`LoadingManager`](https://threejs.org/docs/#api/zh/loaders/managers/LoadingManager) 。创建一个并将其传递给 [`TextureLoader`](https://threejs.org/docs/#api/zh/loaders/TextureLoader)，然后将其[`onLoad`](https://threejs.org/docs/#api/zh/loaders/managers/LoadingManager#onLoad)属性设置为回调。

**代码示例**

```js
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
 
const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
];
loadManager.onLoad = () => {
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
};
 
loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  //urlOfLastItemLoaded -> 最后加载的项目的URL | itemsLoaded -> 目前加载的项目数量 | itemsTotal -> 加载的项目总数。
  // 可以用来显示loading在纹理或者模型未加载完成前
  const progress = itemsLoaded / itemsTotal;
};
```

#### 属性和方法

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [isTexture](https://threejs.org/docs/index.html#api/zh/textures/Texture.isTexture) : Boolean |            检查对象是否为 Texture 类型的只读标志             |
| [name](https://threejs.org/docs/index.html#api/zh/textures/Texture.name) : String |    该对象的名称，可选，且无需唯一。默认值是一个空字符串。    |
| [image](https://threejs.org/docs/index.html#api/zh/textures/Texture.image) : Image | 一个图片对象，通常由[TextureLoader.load](https://threejs.org/docs/index.html#api/zh/loaders/TextureLoader.load)方法创建。 该对象可以是被three.js所支持的任意图片（例如PNG、JPG、GIF、DDS）或视频（例如MP4、OGG/OGV）格式。 |
| [mapping](https://threejs.org/docs/index.html#api/zh/textures/Texture.mapping) : number | 图像将如何应用到物体（对象）上。默认值是[THREE.UVMapping](https://threejs.org/docs/index.html#api/zh/constants/Textures)对象类型， 即UV坐标将被用于纹理映射。<br/>请参阅[texture constants](https://threejs.org/docs/index.html#api/zh/constants/Textures)（映射模式常量）来了解其他映射类型。 |
| [wrapS](https://threejs.org/docs/index.html#api/zh/textures/Texture.wrapS) : number | 这个值定义了纹理贴图在水平方向上将如何包裹，在UV映射中对应于**U**。默认值是[THREE.ClampToEdgeWrapping](https://threejs.org/docs/index.html#api/zh/constants/Textures)，即纹理边缘将被推到外部边缘的纹素。 其它的两个选项分别是[THREE.RepeatWrapping](https://threejs.org/docs/index.html#api/zh/constants/Textures)和[THREE.MirroredRepeatWrapping](https://threejs.org/docs/index.html#api/zh/constants/Textures)。 |
| [wrapT](https://threejs.org/docs/index.html#api/zh/textures/Texture.wrapT) : number | 这个值定义了纹理贴图在垂直方向上将如何包裹，在UV映射中对应于**V**。<br/>可以使用与 .[wrapS](https://threejs.org/docs/index.html#api/zh/textures/Texture.wrapS) : number相同的选项。 |
| [magFilter](https://threejs.org/docs/index.html#api/zh/textures/Texture.magFilter) : number | 当一个纹素覆盖大于一个像素时，贴图将如何采样。默认值为[THREE.LinearFilter](https://threejs.org/docs/index.html#api/zh/constants/Textures)， 它将获取四个最接近的纹素，并在他们之间进行双线性插值。 另一个选项是[THREE.NearestFilter](https://threejs.org/docs/index.html#api/zh/constants/Textures)，它将使用最接近的纹素的值。 |
| [minFilter](https://threejs.org/docs/index.html#api/zh/textures/Texture.minFilter) : number | 当一个纹素覆盖小于一个像素时，贴图将如何采样。默认值为[THREE.LinearMipmapLinearFilter](https://threejs.org/docs/index.html#api/zh/constants/Textures)， 它将使用mipmapping以及三次线性滤镜。 |
| [offset](https://threejs.org/docs/index.html#api/zh/textures/Texture.offset) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) | 在 U 和 V 两个方向上，纹理的单次重复从开始到结束的偏移量是多少? 典型的范围是0.0到1.0。 |
| [repeat](https://threejs.org/docs/index.html#api/zh/textures/Texture.repeat) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) |                   纹理贴图在UV上的重复次数                   |
| [rotation](https://threejs.org/docs/index.html#api/zh/textures/Texture.rotation) : number | 纹理将围绕中心点旋转多少度，单位为弧度（rad）。正值为逆时针方向旋转，默认值为**0**。 |
| [center](https://threejs.org/docs/index.html#api/zh/textures/Texture.center) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) | 旋转中心点。(0.5, 0.5)对应纹理的正中心。默认值为(0,0)，即左下角。 |
| [encoding](https://threejs.org/docs/index.html#api/zh/textures/Texture.encoding) : number | 默认值为[THREE.LinearEncoding](https://threejs.org/docs/index.html#api/zh/constants/Textures)。可选值有THREE.LinearEncoding、 THREE.sRGBEncoding 、THREE.BasicDepthPacking、 THREE.RGBADepthPacking |
| [onUpdate](https://threejs.org/docs/index.html#api/zh/textures/Texture.onUpdate) : Function | 一个回调函数，在纹理被更新后调用。 （例如，当needsUpdate被设为true且纹理被使用。） |
| [needsUpdate](https://threejs.org/docs/index.html#api/zh/textures/Texture.needsUpdate) : Boolean | 将其设置为**true**，以便在下次使用纹理时触发一次更新。 这对于设置包裹模式尤其重要。 |

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [updateMatrix](https://threejs.org/docs/index.html#api/zh/textures/Texture.updateMatrix) () : undefined | 从纹理的[.offset](https://threejs.org/docs/index.html#api/zh/textures/Texture.offset)、[.repeat](https://threejs.org/docs/index.html#api/zh/textures/Texture.repeat)、 [.rotation](https://threejs.org/docs/index.html#api/zh/textures/Texture.rotation)和[.center](https://threejs.org/docs/index.html#api/zh/textures/Texture.center)属性来更新纹理的UV变换矩阵（uv-transform [.matrix](https://threejs.org/docs/index.html#api/zh/textures/Texture.matrix)） |
| [clone](https://threejs.org/docs/index.html#api/zh/textures/Texture.clone) () : [Texture](https://threejs.org/docs/index.html#api/zh/textures/Texture) |        拷贝纹理。注意。这不是“深拷贝”，图像是共用的。        |
| [dispose](https://threejs.org/docs/index.html#api/zh/textures/Texture.dispose) () : undefined |                           销毁纹理                           |
| [transformUv](https://threejs.org/docs/index.html#api/zh/textures/Texture.transformUv) ( uv : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) ) : [Vector2](https://threejs.org/docs/index.html#api/zh/math/Vector2) | 基于纹理的[.offset](https://threejs.org/docs/index.html#api/zh/textures/Texture.offset)、[.repeat](https://threejs.org/docs/index.html#api/zh/textures/Texture.repeat)、 [.wrapS](https://threejs.org/docs/index.html#api/zh/textures/Texture.wrapS)、[.wrapT](https://threejs.org/docs/index.html#api/zh/textures/Texture.wrapT)和[.flipY](https://threejs.org/docs/index.html#api/zh/textures/Texture.flipY)属性值来变换uv。 |

## Camera（相机）

在three.js中，[摄像机(`Camera`)](https://threejs.org/docs/#api/zh/cameras/Camera)和其他对象不同的是，它不一定要在场景图中才能起作用。相同的是，[摄像机(`Camera`)](https://threejs.org/docs/#api/zh/cameras/Camera)作为其他对象的子对象，同样会继承它父对象的位置和朝向。

### PerspectiveCamera（透视相机）

在three.js中最常用的摄像机并且之前我们一直用的摄像机是`透视摄像机 PerspectiveCamera`，它可以提供一个近大远小的3D视觉效果。

[`PerspectiveCamera`](https://threejs.org/docs/#api/zh/cameras/PerspectiveCamera)通过四个属性来定义一个视锥。`near`定义了视锥的前端，`far`定义了后端，`fov`是视野，通过计算正确的高度来从摄像机的位置获得指定的以`near`为单位的视野，定义的是视锥的前端和后端的高度。`aspect`间接地定义了视锥前端和后端的宽度，实际上视锥的宽度是通过高度乘以 aspect 来得到的。

**代码示例**

```js
const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
scene.add( camera );
```


#### 属性和方法

共有属性请参见其基类 [Camera](https://threejs.org/docs/index.html#api/zh/cameras/Camera) 。

|                             属性                             |                             方法                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [aspect](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.aspect) : Float | 摄像机视锥体的长宽比，通常是使用画布的宽/画布的高。默认值是**1**（正方形画布）。 |
| [far](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.far) : Float | 摄像机的远端面，默认值是**2000**。该值必须大于[near](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.near) plane（摄像机视锥体近端面）的值。 |
| [fov](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.fov) : Float | 摄像机视锥体垂直视野角度，从视图的底部到顶部，以角度来表示。默认值是**50**。 |
| [isPerspectiveCamera](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.isPerspectiveCamera) : Boolean |      只读标志，以检查对象是否为 PerspectiveCamera 类型       |
| [near](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.near) : Float |              摄像机的近端面，默认值是**0.1**。               |
| [zoom](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.zoom) : number |       获取或者设置摄像机的缩放倍数，其默认值为**1**。        |

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [updateProjectionMatrix](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.updateProjectionMatrix) () : undefined |     更新摄像机投影矩阵。在任何参数被改变以后必须被调用。     |
| [setViewOffset](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.setViewOffset) ( fullWidth : Float, fullHeight : Float, x : Float, y : Float, width : Float, height : Float ) : undefined | fullWidth — 多视图的全宽设置 fullHeight — 多视图的全高设置 x — 副摄像机的水平偏移 y — 副摄像机的垂直偏移 width — 副摄像机的宽度 height — 副摄像机的高度。在较大的viewing frustum（视锥体）中设置偏移量，对于多窗口或者多显示器的设置是很有用的。 |
| [clearViewOffset](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.clearViewOffset) () : undefined | 清除任何由[.setViewOffset](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.setViewOffset)设置的偏移量。 |

### OrthographicCamera（正交相机）

和指定一个视锥不同的是，它需要设置`left`，`right` `top`，`bottom`，`near`，和`far`指定一个长方体，使得视野是平行的而不是透视的。

这一摄像机使用[orthographic projection](https://en.wikipedia.org/wiki/Orthographic_projection)（正交投影）来进行投影。在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。这对于渲染2D场景或者UI元素是非常有用的。

**代码示例**

```js
const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
scene.add( camera );
```

#### 属性和方法

共有属性请参见其基类[Camera](https://threejs.org/docs/index.html#api/zh/cameras/Camera)。

|                             属性                             |                             方法                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [bottom](https://threejs.org/docs/index.html#api/zh/cameras/OrthographicCamera.bottom) : Float |                     摄像机视锥体下侧面。                     |
| [far](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.far) : Float | 摄像机的远端面，默认值是**2000**。该值必须大于[near](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.near) plane（摄像机视锥体近端面）的值。 |
| [fov](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.fov) : Float | 摄像机视锥体垂直视野角度，从视图的底部到顶部，以角度来表示。默认值是**50**。 |
| [isOrthographicCamera](https://threejs.org/docs/index.html#api/zh/cameras/OrthographicCamera.isOrthographicCamera) : Boolean |      只读标志，以检查对象是否为 OrthographicCamera类型       |
| [near](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.near) : Float |              摄像机的近端面，默认值是**0.1**。               |
| [zoom](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.zoom) : number |       获取或者设置摄像机的缩放倍数，其默认值为**1**。        |
| [left](https://threejs.org/docs/index.html#api/zh/cameras/OrthographicCamera.left) : Float |                     摄像机视锥体左侧面。                     |
| [right](https://threejs.org/docs/index.html#api/zh/cameras/OrthographicCamera.right) : Float |                     摄像机视锥体右侧面。                     |
| [top](https://threejs.org/docs/index.html#api/zh/cameras/OrthographicCamera.top) : Float |                     摄像机视锥体上侧面。                     |

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [updateProjectionMatrix](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.updateProjectionMatrix) () : undefined |     更新摄像机投影矩阵。在任何参数被改变以后必须被调用。     |
| [setViewOffset](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.setViewOffset) ( fullWidth : Float, fullHeight : Float, x : Float, y : Float, width : Float, height : Float ) : undefined | fullWidth — 多视图的全宽设置 fullHeight — 多视图的全高设置 x — 副摄像机的水平偏移 y — 副摄像机的垂直偏移 width — 副摄像机的宽度 height — 副摄像机的高度。在较大的viewing frustum（视锥体）中设置偏移量，对于多窗口或者多显示器的设置是很有用的。 |
| [clearViewOffset](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.clearViewOffset) () : undefined | 清除任何由[.setViewOffset](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.setViewOffset)设置的偏移量。 |

## Light（光照）

### Light

Light( color : Integer, intensity : Float ) 光源的基类 - 所有其他的光类型都继承了该类描述的属性和方法。

#### 属性和方法

公共属性请查看基类[Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D)。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [color](https://threejs.org/docs/index.html#api/zh/lights/Light.color) : [Color](https://threejs.org/docs/index.html#api/zh/math/Color) | 光源的颜色。如果构造的时候没有传递，默认会创建一个新的 [Color](https://threejs.org/docs/index.html#api/zh/math/Color) 并设置为白色。 |
| [intensity](https://threejs.org/docs/index.html#api/zh/lights/Light.intensity) : Float | 光照的强度，或者说能量。 在 [physically correct](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.physicallyCorrectLights) 模式下, [color](https://threejs.org/docs/index.html#api/zh/lights/Light.color) 和强度 的乘积被解析为以坎德拉（candela）为单位的发光强度。 默认值 - **1.0** |
| [isLight](https://threejs.org/docs/index.html#api/zh/lights/Light.isLight) : Boolean |            检查对象是否为 Light 类型的只读标志。             |

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [copy](https://threejs.org/docs/index.html#api/zh/lights/Light.copy) ( source : [Light](https://threejs.org/docs/index.html#api/zh/lights/Light) ) : this | 从[source](https://threejs.org/docs/index.html#api/zh/lights/Light)复制 [color](https://threejs.org/docs/index.html#api/zh/lights/Light.color), [intensity](https://threejs.org/docs/index.html#api/zh/lights/Light.intensity) 的值到当前光源对象中。 |

### AmbientLight

环境光会均匀的照亮场景中的所有物体，**环境光不能用来投射阴影**，因为它没有方向。

环境光只是简单地将材质的颜色与光照颜色进行叠加（PhotoShop 里的正片叠底模式），再乘以光照强度。

```js
color = materialColor * light.color * light.intensity;
```

环境光没有方向，无法产生阴影，场景内任何一点受到的光照强度都是相同的，除了改变场景内所有物体的颜色以外，不会使物体产生明暗的变化，看起来并不像真正意义上的光照。通常的作用是提亮场景，让暗部不要太暗。

**代码示例**

```js
const light = new THREE.AmbientLight( 0x404040 ); 
scene.add( light );
```

#### 属性和方法

公共属性和方法请查看基类 [Light](https://threejs.org/docs/index.html#api/zh/lights/Light)。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [castShadow](https://threejs.org/docs/index.html#api/zh/lights/AmbientLight.castShadow) : Boolean | 这个参数在对象构造的时候就被设置成了 **undefined** 。因为环境光不能投射阴影。 |
| [isAmbientLight](https://threejs.org/docs/index.html#api/zh/lights/AmbientLight.isAmbientLight) : Boolean |         检查对象是否为 AmbientLight 类型的只读标志。         |

### DirectionalLight

平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。

**平行光可以投射阴影** - 跳转至 [DirectionalLightShadow](https://threejs.org/docs/index.html#api/zh/lights/shadows/DirectionalLightShadow) 查看更多细节。

#### 属性和方法

公共属性和方法请查看基类 [Light](https://threejs.org/docs/index.html#api/zh/lights/Light)。

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [castShadow](https://threejs.org/docs/index.html#api/zh/lights/AmbientLight.castShadow) : Boolean | 如果设置为 **true** 该平行光会产生动态阴影。 警告: 这样做的代价比较高而且需要一直调整到阴影看起来正确. 该属性默认为 **false**。 |
| [isDirectionalLight](https://threejs.org/docs/index.html#api/zh/lights/DirectionalLight.isDirectionalLight) : Boolean |       检查对象是否为 DirectionalLight类型的只读标志。        |
| [position](https://threejs.org/docs/index.html#api/zh/lights/DirectionalLight.position) : [Vector3](https://threejs.org/docs/index.html#api/zh/math/Vector3) | 假如这个值设置等于 [Object3D.DEFAULT_UP](https://threejs.org/docs/index.html#api/zh/core/Object3D.DEFAULT_UP) (0, 1, 0),那么光线将会从上往下照射。 |
| [shadow](https://threejs.org/docs/index.html#api/zh/lights/DirectionalLight.shadow) : [DirectionalLightShadow](https://threejs.org/docs/index.html#api/zh/lights/shadows/DirectionalLightShadow) | 这个 [DirectionalLightShadow](https://threejs.org/docs/index.html#api/zh/lights/shadows/DirectionalLightShadow) 对象用来计算该平行光产生的阴影。 |
| [target](https://threejs.org/docs/index.html#api/zh/lights/DirectionalLight.target) : [Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D) | 平行光的方向是从它的位置到目标位置。默认的目标位置为原点 **(0,0,0)**。<br/>注意: 对于目标的位置，要将其更改为除缺省值之外的任何位置,它必须被添加到 [scene](https://threejs.org/docs/index.html#api/zh/scenes/Scene) 场景中去。 |

### PointLight

从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。该光源可以投射阴影

**代码示例**

```js
// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );
```
#### 属性和方法

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [castShadow](https://threejs.org/docs/index.html#api/zh/lights/AmbientLight.castShadow) : Boolean | 如果设置为 **true** 该平行光会产生动态阴影。 警告: 这样做的代价比较高而且需要一直调整到阴影看起来正确. 该属性默认为 **false**。 |
| [decay](https://threejs.org/docs/index.html#api/zh/lights/PointLight.decay) : Float |          指示灯沿着光线的距离变暗的数量。默认值为2           |
| [distance](https://threejs.org/docs/index.html#api/zh/lights/PointLight.distance) : Float | 如果非零，那么光强度将会从最大值当前灯光位置处按照距离线性衰减到0。 缺省值为 **0.0**。 |
| [power](https://threejs.org/docs/index.html#api/zh/lights/PointLight.power) : Float |                            光功率                            |
| [shadow](https://threejs.org/docs/index.html#api/zh/lights/PointLight.shadow) : [PointLightShadow](https://threejs.org/docs/index.html#api/zh/lights/shadows/PointLightShadow) | [PointLightShadow](https://threejs.org/docs/index.html#api/zh/lights/shadows/PointLightShadow)用与计算此光照的阴影。 |

### 总结

每添加一个光源到场景中，都会降低 three.js 渲染场景的速度，所以应该尽量使用最少的资源来实现想要的效果。

## WebGLRenderer（渲染器）

three.js的主要对象。你传入一个Scene和一个Camera到Renderer中，然后它会将摄像机视椎体中的三维场景渲染成一个二维图片显示在画布上。

**代码示例**

```js
// WebGLRenderer( parameters : Object )
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('black', 1);
```

### parameters

* canvas - 一个供渲染器绘制其输出的[canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 它和下面的[domElement](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.domElement)属性对应。 如果没有传这个参数，会创建一个新canvas
* context - 可用于将渲染器附加到已有的渲染环境([RenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext))中。默认值是null
* precision - 着色器精度. 可以是 **"highp"**, **"mediump"** 或者 **"lowp"**. 如果设备支持，默认为**"highp"** .
* alpha -控制默认的透明alpha值。设置为true时，值为0。否则为1。默认值为false
* premultipliedAlpha - renderer是否假设颜色有 [premultiplied alpha](https://en.wikipedia.org/wiki/Glossary_of_computer_graphics#Premultiplied_alpha). 默认为**true**
* antialias - 是否执行抗锯齿。默认为**false**.
* ogarithmicDepthBuffer - 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。

### 属性和方法

|                             属性                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [autoClear](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.autoClear) : Boolean |        定义渲染器是否在渲染每一帧之前自动清除其输出。        |
| [autoClearColor](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.autoClearColor) : Boolean | 如果[autoClear](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.autoClear)为true, 定义renderer是否清除颜色缓存。 默认是**true** |
| [autoClearDepth](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.autoClearDepth) : Boolean | 如果[autoClear](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.autoClear)是true, 定义renderer是否清除深度缓存。 默认是**true** |
| [domElement](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.domElement) : DOMElement | 一个[canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)，渲染器在其上绘制输出。<br/>渲染器的构造函数会自动创建(如果没有传入canvas参数);你需要做的仅仅是像下面这样将它加页面里去:<br/>`document.body.appendChild( renderer.domElement );` |
| [outputEncoding](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.outputEncoding) : number | 定义渲染器的输出编码。默认为[THREE.LinearEncoding](https://threejs.org/docs/index.html#api/zh/constants/Textures) |
| [physicallyCorrectLights](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.physicallyCorrectLights) : Boolean |       是否使用物理上正确的光照模式。 默认是**false**。       |
| [shadowMap](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.shadowMap) : WebGLShadowMap | 如果使用，它包含阴影贴图的引用。<br/>\- enabled: 如果设置开启，允许在场景中使用阴影贴图。默认是 **false**。<br/>\- autoUpdate: 启用场景中的阴影自动更新。默认是**true**<br/>- type: 定义阴影贴图类型 (未过滤, 关闭部分过滤, 关闭部分双线性过滤), 可选值有:THREE.BasicShadowMap、THREE.PCFShadowMap (默认)、THREE.PCFSoftShadowMap、THREE.VSMShadowMap |
| [state](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.state) : Object | 包含设置[WebGLRenderer.context](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.context)状态的各种属性的函数。 |
| [toneMapping](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.toneMapping) : Constant | 默认是[NoToneMapping](https://threejs.org/docs/index.html#api/zh/constants/Renderer) |
| [toneMappingExposure](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.toneMappingExposure) : Number |               色调映射的曝光级别。默认是**1**                |

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| .[clear](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.clear) ( color : Boolean, depth : Boolean, stencil : Boolean ) : undefined | 告诉渲染器清除颜色、深度或模板缓存. 此方法将颜色缓存初始化为当前颜色。参数们默认都是**true** |
| [compile](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.compile) ( scene : [Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D), camera : [Camera](https://threejs.org/docs/index.html#api/zh/cameras/Camera) ) : undefined | 使用相机编译场景中的所有材质。这对于在首次渲染之前预编译着色器很有用。 |
| [dispose](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.dispose) ( ) : undefined |                      销毁当前的渲染环境                      |
| [getContext](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.getContext) () : WebGL2RenderingContext |                      返回当前WebGL环境                       |
| [render](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.render) ( scene : [Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D), camera : [Camera](https://threejs.org/docs/index.html#api/zh/cameras/Camera) ) : undefined | 用相机([camera](https://threejs.org/docs/index.html#api/zh/cameras/Camera))渲染一个场景([scene](https://threejs.org/docs/index.html#api/zh/scenes/Scene))或是其它类型的[object](https://threejs.org/docs/index.html#api/zh/core/Object3D)。 |
| .[setClearAlpha](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setClearAlpha) ( alpha : Float ) : undefined |    设置alpha。合法参数是一个**0.0**到 **1.0**之间的浮点数    |
| .[setClearColor](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setClearColor) ( color : [Color](https://threejs.org/docs/index.html#api/zh/math/Color), alpha : Float ) : undefined |                      设置颜色及其透明度                      |
| .[setPixelRatio](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setPixelRatio) ( value : number ) : undefined |       设置设备像素比。通常用于避免HiDPI设备上绘图模糊        |
| .[setScissor](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setScissor) ( x : Integer, y : Integer, width : Integer, height : Integer ) : undefined |        将剪裁区域设为(x, y)到(x + width, y + height)         |
| .[setScissorTest](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setScissorTest) ( boolean : Boolean ) : undefined | 启用或禁用剪裁检测. 若启用，则只有在所定义的裁剪区域内的像素才会受之后的渲染器影响。 |
| .[setSize](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setSize) ( width : Integer, height : Integer, updateStyle : Boolean ) : undefined | 将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小 将updateStyle设置为false以阻止对canvas的样式做任何改变。 |
| .[setViewport](https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.setViewport) ( x : Integer, y : Integer, width : Integer, height : Integer ) : undefined |      将视口大小设置为(x, y)到 (x + width, y + height).       |

