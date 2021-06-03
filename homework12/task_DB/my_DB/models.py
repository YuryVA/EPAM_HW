from django.db import models


class Homework(models.Model):
    hmw_id = models.CharField("Homework id", max_length=200)
    text = models.TextField("Homework Text")
    created = models.DateTimeField("Created")
    deadline = models.DateTimeField("Deadline")

    def __str__(self):
        return '%s %s %s %s' % (self.hmw_id, self.text, self.created, self.deadline)


class Students(models.Model):
    first_name = models.CharField("First Name", max_length=200)
    last_name = models.CharField("Last Name", max_length=200)
    hmw_id = models.ForeignKey(Homework, on_delete=models.CASCADE)
    hmw_res = models.TextField("Homework Solution")

    def __str__(self):
        return '%s %s %s %s' % (self.first_name, self.last_name, self.hmw_id, self.hmw_res)


class Teachers(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    hmw_id = models.ForeignKey(Homework, on_delete=models.CASCADE)

    def __str__(self):
        return '%s %s %s' % (self.first_name, self.last_name, self.hmw_id)
