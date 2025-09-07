//Program to print the sum of digits of any number using for loop
#include<stdio.h>
int main(void)
{
    int n, sum = 0, rem;
    printf("Enter a number: ");
    scanf("%d", &n);
    for(;n>0;n/=10)
    {
        rem=n%10;
        sum+=rem;

    }
    printf("Sum of digits = %d\n", sum);
    return 0;
}