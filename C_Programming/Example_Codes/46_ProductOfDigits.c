//Program to find the sum of digits of any number
#include<stdio.h>
int main(void)
{
    int n, prod = 1, rem;
    printf("Enter a number: ");
    scanf("%d", &n);
    while (n>0)
    {
        rem = n%10;
        prod*=rem;
        n/=10;
    }
printf("Product of digits = %d\n", prod);
return 0;
}