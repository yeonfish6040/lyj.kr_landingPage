pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'jenkins-admin-user', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        echo $password | docker login --username $username --password-stdin
                        docker build -f Dockerfile -t $username/lyj_landingpage .
                        docker push $username/lyj_landingpage
                        """
                    }
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                script {
                    sh """
                    sudo docker ps
                    sudo docker stop lyj_landingpage || true
                    sudo docker rm lyj_landingpage || true
                    sudo docker pull $username/lyj_landingpage
                    sudo docker run -d --name lyj_landingpage --restart always -p 9002:3000 $username/lyj_landingpage
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