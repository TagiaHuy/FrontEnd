pipeline {
 agent any
 
 stages {
	stage('clone'){
		steps {
			echo 'Cloning source code'
			git branch:'main', url: 'https://github.com/TagiaHuy/PlantCraft.git'
		}
	} // end clone

  } // end stages
}//end pipeline