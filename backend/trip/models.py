from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    cycle_used = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pickup_location} → {self.dropoff_location}"


class LogSheet(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    day = models.IntegerField()
    driving_hours = models.FloatField(default=0.0)
    on_duty_hours = models.FloatField(default=0.0)
    rest_hours = models.FloatField(default=0.0)
