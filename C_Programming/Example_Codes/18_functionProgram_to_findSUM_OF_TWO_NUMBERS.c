#include<stdio.h>
int sum(int x, int y);
int main (void)
{
    int a, b, s;
    printf("Enter the values for a and b: ");
    scanf("%d%d", &a, &b);
    s = sum(a, b);
    printf("Sum of %d and %d is %d\n", a , b, s);
    return 0;
}
int sum(int x, int y)
{
    int s;
    s = x + y;
    return s;
}