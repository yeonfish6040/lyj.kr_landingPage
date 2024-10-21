pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_PASSWORD = credentials('dockerhub-password')
        SERVER_PRIVATEKEY = credentials('server-privatekey')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh """
                    echo $DOCKERHUB_PASSWORD | docker login --username $DOCKERHUB_USERNAME --password-stdin
                    docker build -f Dockerfile -t $DOCKERHUB_USERNAME/lyj_landingpage .
                    docker push $DOCKERHUB_USERNAME/lyj_landingpage
                    """
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$SERVER_IP << 'EOF'
                    sudo docker ps
                    sudo docker stop lyj_landingpage || true
                    sudo docker rm lyj_landingpage || true
                    sudo docker pull $DOCKERHUB_USERNAME/lyj_landingpage
                    sudo docker run -d --name lyj_landingpage --restart always -p 9002:3000 $DOCKERHUB_USERNAME/lyj_landingpage
                    sudo docker network connect lyj_default lyj_landingpage
                    sudo docker image prune -f
                    EOF
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}