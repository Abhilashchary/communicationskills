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

        stage('Deploy') {
            steps {
                echo 'Deploying to GitHub Pages...'
                bat '''
                git config user.name "jenkins"
                git config user.email "jenkins@example.com"

                git checkout -B gh-pages

                echo Cleaning old files...
                git rm -r --cached .

                rem Delete all files/folders except .git folder
                for /d %%D in (*) do if /I not "%%D"==".git" rmdir /S /Q "%%D"
                for %%F in (*) do if /I not "%%F"==".git" del /Q /F "%%F"

                rem Copy all files from the workspace (original branch) to current folder
                xcopy /E /Y /I ..\\* .

                git add -A
                git diff --cached --quiet || git commit -m "Deploy via Jenkins [ci skip]"
                git push -f origin gh-pages
                '''
            }
        }
    }
}
