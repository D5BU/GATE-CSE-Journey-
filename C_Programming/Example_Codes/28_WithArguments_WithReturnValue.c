#include<stdio.h>
int sum(int n);
int main(void)
{
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    printf("Sum of digits of %d is %d\n", num, sum(num));
    return 0;

}
int sum (int n)
{
    int sum=0;
    while (n>0)
    {
        sum+=n%10;
        n/=10;
    }
    return sum;
}