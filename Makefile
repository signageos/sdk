getaws:
	 rm -rf awscli-bundle.zip awscli-bundle || echo "No AWS Cli"
	 curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
	 unzip -o awscli-bundle.zip
	 ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
	 rm -rf awscli-bundle.zip awscli-bundle
