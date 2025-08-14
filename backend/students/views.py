from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from .models import Student
from .serializers import StudentSerializer

class StudentFilter(filters.FilterSet):
    # Grade filter
    grade = filters.ChoiceFilter(
        choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('F', 'F')]
    )
    
    # Midterm score filters
    midterm_score = filters.NumberFilter()
    midterm_score__lt = filters.NumberFilter(field_name='midterm_score', lookup_expr='lt')
    midterm_score__lte = filters.NumberFilter(field_name='midterm_score', lookup_expr='lte')
    midterm_score__gt = filters.NumberFilter(field_name='midterm_score', lookup_expr='gt')
    midterm_score__gte = filters.NumberFilter(field_name='midterm_score', lookup_expr='gte')
    
    # Final exam score filters
    final_exam_score = filters.NumberFilter()
    final_exam_score__lt = filters.NumberFilter(field_name='final_exam_score', lookup_expr='lt')
    final_exam_score__lte = filters.NumberFilter(field_name='final_exam_score', lookup_expr='lte')
    final_exam_score__gt = filters.NumberFilter(field_name='final_exam_score', lookup_expr='gt')
    final_exam_score__gte = filters.NumberFilter(field_name='final_exam_score', lookup_expr='gte')

    class Meta:
        model = Student
        fields = [
            'grade', 
            'midterm_score', 'midterm_score__lt', 'midterm_score__lte', 'midterm_score__gt', 'midterm_score__gte',
            'final_exam_score', 'final_exam_score__lt', 'final_exam_score__lte', 'final_exam_score__gt', 'final_exam_score__gte'
        ]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = StudentFilter
    search_fields = ['name']
    ordering_fields = ['name', 'grade', 'midterm_score', 'final_exam_score']  # Removed final_score