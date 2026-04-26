#!/bin/bash
# Simple Liferay Theme Deployment Script for Linux/Mac

echo "Building Simple Liferay Theme..."

# Clean and package the theme
mvn clean package -Dmaven.test.skip=true

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build successful!"

# Set your Liferay deploy directory here
LIFERAY_DEPLOY_DIR="/path/to/liferay/deploy"

# Check if deploy directory is set and exists
if [ -z "$LIFERAY_DEPLOY_DIR" ]; then
    echo "Please set LIFERAY_DEPLOY_DIR in this script"
    exit 1
fi

if [ ! -d "$LIFERAY_DEPLOY_DIR" ]; then
    echo "Deploy directory does not exist: $LIFERAY_DEPLOY_DIR"
    exit 1
fi

# Copy the WAR file to Liferay deploy directory
echo "Deploying to: $LIFERAY_DEPLOY_DIR"
cp target/simple-liferay-theme-1.0.0.war "$LIFERAY_DEPLOY_DIR/"

if [ $? -eq 0 ]; then
    echo "Theme deployed successfully!"
    echo "Check Liferay logs for deployment status."
else
    echo "Deployment failed!"
    exit 1
fi
