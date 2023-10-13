FROM openjdk:17

COPY merci-0.1.jar /c/Users/jinwoosi/merci/merci.jar
RUN chmod +x /c/Users/jinwoosi/merci/merci.jar

EXPOSE 8081

ENTRYPOINT ["java","-jar","/c/Users/jinwoosi/merci/merci.jar"]