if [ -d "./dist" ]; then
  if [ -d "../MIAO-java" ]; then
    rm -rf ../MIAO-java/src/main/resources/static/*
    cp -R ./dist/* ../MIAO-java/src/main/resources/static/
    echo "copyed to ../MIAO-java"
  else
    echo "MIAO-java not exist"
  fi
  if [ -d "../MIAO-python" ]; then
    rm -rf ../MIAO-python/miaolib/static/*
    cp -R ./dist/* ../MIAO-python/miaolib/static
    echo "copyed to ../MIAO-python"
  else
    echo "MIAO-python not exist"
  fi
else
  echo "dist not found"
fi
