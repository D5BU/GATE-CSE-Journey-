//Program to find out the factorial of any given number
#include<stdio.h>
int main(void)
{
    int n, num;
    long fact = 1;
    printf("Enter a number: ");
    scanf("%d", &n);
    num = n;
    if(n<0)
        printf("No factorial of negative number!");
    else
    {
        while(n>1)
        {
            fact *=n;
            n--;
        }
        printf("Factorial of %d = %1d\n", num, fact);

    }
    return 0;
}