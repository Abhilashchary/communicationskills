pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'No build needed for static site'
            }
        }

        stage('Test') {
            steps {
                echo 'No tests configured'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to GitHub Pages...'
                bat '''
                git config user.name "jenkins"
                git config user.email "jenkins@example.com"
                git checkout -B gh-pages
                git add -f .
                git commit -m "Deploy via Jenkins [ci skip]"
                git push -f origin gh-pages
                '''
            }
        }
    }
}
