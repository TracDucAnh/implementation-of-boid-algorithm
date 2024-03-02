const flock = [];

let alignSlider, cohesionSlider, separationSlider;

function setup()
{
    createCanvas(1500, 700);
    alignSlider = createSlider(0, 10, 2, 0.1);
    cohesionSlider = createSlider(0, 10, 2, 0.1);
    separationSlider = createSlider(0, 10, 2, 0.1);;
    for (let i = 0; i < 500; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    background(64,64,64);

    for (let boid of flock){
        boid.show();
        boid.edges();
        boid.update();
        boid.combine(flock);
    }
}

class Boid
{
    constructor () {
        this.velocity = p5.Vector.random2D();
        this.position = createVector(random(0, width), random(0, height));
        this.velocity.setMag(random(1, 5));
        this.acceleration = createVector();
        this.maxForce = 0.1;
        this.maxSpeed = 4;
    }

    show() {
        strokeWeight(5);
        stroke(255);
        point(this.position.x, this.position.y)
    }

    update()
    {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

    edges() {
        if (this.position.x < 0) {
            this.position.x = width;
        }
        else if(this.position.x > width)
        {
            this.position.x = 0;
        }
        if (this.position.y < 0) {
            this.position.y = height;
        }
        else if(this.position.y > height)
        {
            this.position.y = 0;
        }
    }
    // alignment

    alignment(boids)
    {
        let radius = 50;
        let count = 0;
        let average = createVector();
        for (let boid of boids){
            let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if(distance <= radius && boid!=this){
                average.add(boid.velocity);
                count++;
            }
        }
        if (count > 0){
            average.div(count);
        }
        average.setMag(this.maxSpeed);
        let alignment = average.sub(this.velocity);
        average.limit(this.maxForce);
        return average;
    }


    // cohesion

    cohesion(boids)
    {
        let radius = 100;
        let count = 0;
        let average = createVector();
        for (let boid of boids){
            let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if(distance <= radius && boid!=this){
                average.add(boid.position);
                count++;
            }
        }
        if (count > 0){
            average.div(count);
        }
        let alignment = average.sub(this.position);
        alignment = average.sub(this.velocity);
        average.limit(this.maxForce);
        return average;
    }

    separation(boids)
    {
        let radius = 100;
        let count = 0;
        let average = createVector();
        for (let boid of boids){
            let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if(distance <= radius && boid!=this){
                let different = p5.Vector.sub(this.position, boid.position);
                different.div(distance);
                average.add(different);
                count++;
            }
        }
        if (count > 0)
        {
            average.div(count);
            average.setMag(this.maxSpeed);
            average.sub(this.velocity);
            average.limit(this.maxForce);
        }
        return average;
    }

    // combine cohesion and alignment

    combine (boids){
        this.acceleration.mult(0);
        let alignment = this.alignment(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        alignment.mult(separationSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());
        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

}
