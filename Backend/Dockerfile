# Use the official Python runtime image
FROM python:3.13-alpine
 
# Create the app directory
RUN mkdir /app
 
# Set the working directory inside the container
WORKDIR /app
 
# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 

RUN apk update && \
    apk add musl-dev libpq-dev gcc
 
# Upgrade pip
RUN pip install --upgrade pip 
 
# Copy the Django project  and install dependencies
COPY requirements.txt  /app/
 
# run this command to install all dependencies 
RUN pip install --no-cache-dir -r requirements.txt
 
# Copy the Django project to the container
# COPY . /app/
COPY ./turnero /app/turnero
COPY ./inicio /app/inicio

COPY manage.py /app/
COPY initdata.json /app/
 
# Expose the Django port
EXPOSE 3000

# Run Django’s development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:3000"]