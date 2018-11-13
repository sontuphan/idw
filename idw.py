import math
import numpy as np
import matplotlib.pyplot as plt

sample = [900, 2020, 5339, 608, 0, 0, 0, 0, 6337]
points = [0] + sample + [0]
print points


def d(a, b):
    return (abs(a-b))**4


def w(a, b):
    return 1/d(a, b)


def u(x, points):
    _w = 0
    _wu = 0
    for i, v in enumerate(points):
        if x == i:
            return v
        else:
            _w += w(x, i)
            _wu += w(x, i)*v
    return _wu/_w


def y(x, points):
    _y = []
    for _x in x:
        _y.append(u(_x, points))
    return _y


def py(y):
    _py = []
    sum = np.sum(y)
    print sum
    for i in y:
        _py.append(float(i)/float(sum))
    return _py


def median(_x, _y):
    sta = 0
    end = len(_x)
    mid = int(math.floor((sta+end)/2))
    lhalf = np.sum(_y[0:mid])
    rhalf = np.sum(_y[mid:len(_x)])
    while lhalf == 0 or rhalf == 0 or abs(lhalf-rhalf) >= 0.001:
        if lhalf > rhalf:
            end = mid
        else:
            sta = mid
        mid = int(math.floor((sta+end)/2))
        lhalf = np.sum(_y[0:mid])
        rhalf = np.sum(_y[mid:len(_x)])
    return _x[mid], _y[mid]


def medium(_x, _y):
    sum = 0
    for i in range(len(_x)):
        sum += _x[i]*_y[i]
    for i in range(len(_x)):
        if sum > _x[i] and sum < _x[i+1]:
            return _x[i], _y[i]


# Support to plot bar chart
def knownX(points):
    re = []
    for i, v in enumerate(points):
        re.append(i)
    return re


concreteX = knownX(points)
concreteY = py(y(concreteX, points))
continousX = np.arange(0, len(points)-1, 0.0001)
continousY = py(y(continousX, points))
median_x, median_y = median(continousX, continousY)
medium_x, medium_y = medium(continousX, continousY)

fig, ax1 = plt.subplots()
ax2 = ax1.twinx()
plt.title('Score distribution')
plt.grid(True)
ax1.set_xticks(np.arange(0, len(points)-1, 1))
ax1.set_xticklabels(np.arange(0, len(points)-1, 1))
ax1.set_xlabel('Score')

color1 = 'blue'
ax1.set_ylabel('Continous Probability', color=color1)
ax1.plot(continousX, continousY, color=color1)
ax1.tick_params(axis='y', labelcolor=color1)

color2 = 'green'
ax2.set_ylabel('Concrete Probability', color=color2)
width = 0.1
ax2.bar(concreteX, concreteY, width, color=color2, align='center')
ax2.tick_params(axis='y', labelcolor=color2)

ax1.plot([median_x], [median_y], 'ro')
ax1.plot([medium_x], [medium_y], 'bo')

plt.show()
