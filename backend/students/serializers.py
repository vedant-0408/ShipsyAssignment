from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    final_score = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ['id', 'name', 'grade', 'is_active', 'midterm_score', 'final_exam_score', 'final_score', 'created_at', 'updated_at']
