# 1 Binary Search

* off-by-one error를 방지하기 위한 전략

1. [low, high]가 check(low) != check(high)가 되도록 구간을 설정
2. `while (low + 1 < high)`
   * `mid = (low + high) // 2`
   * `if check(mid) == check(low) then low = mid`
   * `else then high = mid`
3. 답은 low 또는 high 문제에 따라 생각해보기

> 위에서 check 메서드는 결정 문제를 나타낸다. 결정 문제란 답이 Yes or No인 문제를 의미한다



# 2 Lower Bound & Upper Bound



## 2.1 Lower Bound

* 정렬된 배열에 임의의 수를 삽입할 가장 왼쪽 인덱스를 찾는 알고리즘
  * Lower Bound는 v[i - 1] < k <= v[i]인 i를 찾아주는 함수로, v[i] >= k인 i의 최솟값을 반환한다
  * 만약 v의 모든 원소가 k보다 작다면 v의 마지막 다음 칸의 위치를 반환한다.

* 삽입 이후에도 정렬 순서는 유지된다

```python
def my_bisect_left(array, target):
    low = -1
    high = len(array)
    while low + 1 < high:
        mid = (low + high) // 2
        if array[mid] >= target:
            high = mid
        else:
            low = mid
    return high
```



## 2.2 Upper Bound

* 정렬된 배열에 임의의 수를 삽입할 가장 오른쪽 인덱스를 찾는 알고리즘
  * upper_bound는 v[i - 1] <= k < v[i]인 i를 찾아주는 함수로 v[i] > k인 i의 최솟값을 반환한다.
  * v의 모든 원소가 k보다 작거나 같다면 v의 마지막 다음 칸의 위치를 반환한다.

* 삽입 이후에도 정렬 순서는 유지된다

```python
def my_bisect_right(array, target):
    low = -1
    high = len(array)
    while low + 1 < high:
        mid = (low + high) // 2
        if array[mid] > target:
            high = mid
        else:
            low = mid
    return high
```



## 2.3 특정 원소의 개수 구하기

- 정렬된 상태의 v라는 배열이 있을 때
- `upper_bound(v, x) - lower_bound(v, x)`는 항상 v 내의 x의 개수를 나타낸다
  - v 내에 x가 없다면 0이다. -> upper_bound와 lower_bound의 값이 같기 때문



# 3 Parametric Search

* 최적화 문제를 결정 문제로 바꾸어 해결하는 기법



**예제**

* https://www.acmicpc.net/problem/1654



참고자료

* https://www.acmicpc.net/blog/view/109