# Interactive Bézier Curve with Live Math & Physics

A real-time interactive Bézier curve simulation that demonstrates mathematical calculations and spring physics.

## Features
- ✅ Cubic Bézier curve with manual mathematical implementation
- ✅ Real-time tangent vector visualization  
- ✅ Spring-damping physics simulation
- ✅ Live mathematical calculations display
- ✅ 60 FPS smooth animation
- ✅ Mouse-interactive control points

## Math Implemented
- **Bézier Curve**: `B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃`
- **Tangent Vectors**: `B'(t) = 3(1−t)²(P₁−P₀) + 6(1−t)t(P₂−P₁) + 3t²(P₃−P₂)`
- **Physics**: Spring-damping model: `acceleration = -k × displacement - damping × velocity`

## Results
| **Feature 1** | **Feature 2** | **Feature 3** |
|---------------|---------------|---------------|
| ![Alt Text 1](image1.jpg) | ![Alt Text 2](image2.jpg) | ![Alt Text 3](image3.jpg) |


## 🎥 Live Demo

[**Output**](https://drive.google.com/file/d/1Zu_cWLO0RH2OhmHWoBf9amRGWlerXs2A/view?usp=sharing)

## Run Locally
```bash
git clone https://github.com/Sunny22110010324/bezier-curve.git
cd bezier-curve
# Open index.html in web browser

