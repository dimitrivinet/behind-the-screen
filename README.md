# Behind The Screen

Behind The Screen is a Computer Graphics project aiming to turn your screens into portals to other worlds by creating a seamless transition from real to virtual world. It uses Artifical Intelligence to detect where the user is looking (Gaze Detection), as well as the position of their body (Pose Estimation), and exploits these data to orient the camera within the scene. If the user leans to the left and forward, the camera pans to the right and also moves forward, allowing to see what is "behind" the screen in the scene, just like a window. From a Computer Graphics point of view, the project consists of rendering a panoramic scene and moving the camera within the scene.

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).
