pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Abhilashchary/communicationskills.git'
            }
        }

        stage('Debug Workspace') {
            steps {
                echo 'Workspace listing for debug:'
                bat 'dir /S'
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

                echo Cleaning tracked files but preserving .git folder...
                git rm -r --cached .

                rem Delete all files/folders except .git
                for /d %%D in (*) do (
                    if /I not "%%D"==".git" rmdir /S /Q "%%D"
                )
                for %%F in (*) do (
                    if /I not "%%F"==".git" del /Q /F "%%F"
                )

                echo Listing docs folder content:
                dir docs

                echo Copying site files from docs to current directory...
                xcopy /E /Y /I docs\\* .

                git add -A

                git diff --cached --quiet || git commit -m "Deploy via Jenkins [ci skip]"
                git push -f origin gh-pages
                '''
            }
        }
    }
}
