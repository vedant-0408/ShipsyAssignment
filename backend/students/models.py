from django.db import models

class DateTimeModel(models.Model):
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Student(DateTimeModel):
    GRADE_CHOICES = [('A','A'),('B','B'),('C','C'),('D','D')]
    name = models.CharField(max_length=255)
    grade = models.CharField(max_length=1, choices=GRADE_CHOICES)
    is_active = models.BooleanField(default=True)
    midterm_score = models.IntegerField()
    final_exam_score = models.IntegerField()

    @property
    def final_score(self):
        return self.midterm_score + self.final_exam_score