# meta-pro-navigator
Hackathon project

A brief description of the project.

Requirements
Docker
Docker Compose

Installation
Clone the repository: git clone https://github.com/paulocilasjr/meta-pro-navigator
Navigate to the project directory: cd meta-pro-navigator

Usage
Docker Compose
The easiest way to run the application is to use Docker Compose. Docker Compose will start both the R API and the front-end application.

Make sure you are in the project directory.
Run the following command: docker-compose up
Open a web browser and go to http://localhost:3000 to view the application.

Manual Build and Run
Alternatively, you can build and run the R API and front-end application manually.

R API
Navigate to the r_api directory: cd r_api
Build the Docker image: docker build -t r-api .
Run the Docker container: docker run -p 80:80 r-api
The R API should now be available at http://localhost:80.

Front-end Application
Navigate to the Frontend directory: cd Frontend
Build the Docker image: docker build -t frontend .
Run the Docker container: docker run -p 3000:3000 frontend
The front-end application should now be available at http://localhost:3000.

Contributing
If you would like to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch: git checkout -b feature-name
Make your changes and commit them: git commit -m "Add some feature"
Push to the branch: git push origin feature-name
Submit a pull request.
