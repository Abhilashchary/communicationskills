pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
               git branch: 'main', url: 'https://github.com/Abhilashchary/communicationskills.git'
            }
        }

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

                echo Cleaning old files...
                git rm -r --cached . >nul 2>&1
                del /Q /F /S * >nul 2>&1 || echo No files to delete

                echo Listing docs folder content for debugging:
                dir docs

                echo Copying site files from docs...
                xcopy /E /Y /I docs\\* .

                git add -A
                git diff --cached --quiet || git commit -m "Deploy via Jenkins [ci skip]"
                git push -f origin gh-pages
                '''
            }
        }
    }
}
