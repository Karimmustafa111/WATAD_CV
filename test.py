from ultralytics import YOLO

model = YOLO('best.pt')

results = model.predict('wall.jpg', conf=0.15)

results[0].save(filename='result_wall.jpg')
print("تم حفظ الصورة بنجاح!")